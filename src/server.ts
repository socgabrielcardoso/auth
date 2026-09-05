import {createServer, type IncomingMessage, type ServerResponse} from "node:http";
import {resolve} from "node:path";
import {createMethodContext} from "./core/context.js";
import {ChallengeStore} from "./core/store.js";
import {loadMethods} from "./core/loader.js";
import {RateLimiter} from "./core/rate-limit.js";
import {applySecurityHeaders, cookie, cookies, readJson, sendJson, serveStatic} from "./core/http.js";
import type {AuthMethod, JsonObject, JsonValue} from "./core/types.js";

const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const host = process.env.HOST ?? "0.0.0.0";
const production = process.env.NODE_ENV === "production";
const publicRoot = resolve(process.cwd(), "public");
const context = createMethodContext();
const challenges = new ChallengeStore(context);
const limiter = new RateLimiter(context.now);
const methods = await loadMethods();

const server = createServer(async (request, response) => {
    applySecurityHeaders(response);
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const client = request.socket.remoteAddress ?? "unknown";

    try {
        if (!limiter.allow(`${client}|${url.pathname}`, 40, 60_000)) {
            sendJson(response, 429, {error: "Too many requests"});
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/health") {
            sendJson(response, 200, {status: "ok", methods: methods.size});
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/methods") {
            const descriptors = [...methods.values()]
                .map(method => method.descriptor)
                .sort((left, right) => left.order - right.order);
            sendJson(response, 200, descriptors as unknown as JsonValue);
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/csrf") {
            const token = context.randomToken(24);
            response.setHeader("Set-Cookie", cookie("auth_csrf", token, 3600, production));
            sendJson(response, 200, {token});
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/session") {
            sendJson(response, 200, session(request));
            return;
        }

        const startMatch = url.pathname.match(/^\/api\/methods\/([a-z0-9-]+)\/start$/);
        if (request.method === "POST" && startMatch) {
            requireCsrf(request);
            const method = methodById(startMatch[1]);
            const input = await readJson(request);
            const draft = await method.start(context, input);
            const challenge = challenges.create(method.descriptor.id, draft);
            audit("challenge_started", {method: method.descriptor.id, challenge: challenge.challengeId, client});
            sendJson(response, 201, challenge as unknown as JsonValue);
            return;
        }

        const verifyMatch = url.pathname.match(/^\/api\/methods\/([a-z0-9-]+)\/verify$/);
        if (request.method === "POST" && verifyMatch) {
            requireCsrf(request);
            const method = methodById(verifyMatch[1]);
            const input = await readJson(request);
            const challengeId = typeof input.challengeId === "string" ? input.challengeId : "";
            const challenge = challenges.get(challengeId, method.descriptor.id);
            if (!challenge) {
                sendJson(response, 410, {error: "Challenge is missing or expired"});
                return;
            }
            const verification = await method.verify(context, challenge, input);
            if (!verification.ok) {
                const remaining = challenges.fail(challengeId);
                audit("challenge_rejected", {method: method.descriptor.id, challenge: challengeId, client, remaining});
                sendJson(response, 401, {ok: false, message: verification.message, attemptsRemaining: remaining});
                return;
            }
            challenges.complete(challengeId);
            const expiresAt = context.now() + 30 * 60_000;
            const sessionToken = context.sign(JSON.stringify({subject: verification.subject, method: method.descriptor.id, expiresAt}));
            response.setHeader("Set-Cookie", cookie("auth_session", sessionToken, 1800, production));
            audit("authentication_completed", {method: method.descriptor.id, client});
            sendJson(response, 200, {...verification, expiresAt} as unknown as JsonValue);
            return;
        }

        if (request.method === "GET" && await serveStatic(response, publicRoot, url.pathname)) {
            return;
        }
        sendJson(response, 404, {error: "Not found"});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Request failed";
        const status = message === "CSRF validation failed" ? 403 : 400;
        audit("request_rejected", {path: url.pathname, client, status});
        sendJson(response, status, {error: message});
    }
});

server.listen(port, host, () => {
    process.stdout.write(`${JSON.stringify({event: "server_started", host, port, methods: methods.size, demoMode: context.demoMode})}\n`);
});

function methodById(id: string | undefined): AuthMethod {
    const method = id ? methods.get(id) : undefined;
    if (!method) {
        throw new Error("Authentication method not found");
    }
    return method;
}

function requireCsrf(request: IncomingMessage): void {
    const header = request.headers["x-csrf-token"];
    const supplied = Array.isArray(header) ? header[0] : header;
    const stored = cookies(request).auth_csrf;
    if (!supplied || !stored || !context.safeEqual(supplied, stored)) {
        throw new Error("CSRF validation failed");
    }
}

function session(request: IncomingMessage): JsonValue {
    const token = cookies(request).auth_session;
    if (!token) {
        return {authenticated: false};
    }
    const payload = context.verifySigned(token);
    if (!payload) {
        return {authenticated: false};
    }
    try {
        const value = JSON.parse(payload) as {subject?: string; method?: string; expiresAt?: number};
        if (!value.subject || !value.method || !value.expiresAt || value.expiresAt <= context.now()) {
            return {authenticated: false};
        }
        return {authenticated: true, subject: value.subject, method: value.method, expiresAt: value.expiresAt};
    } catch {
        return {authenticated: false};
    }
}

function audit(event: string, details: JsonObject): void {
    process.stdout.write(`${JSON.stringify({time: new Date(context.now()).toISOString(), event, ...details})}\n`);
}
