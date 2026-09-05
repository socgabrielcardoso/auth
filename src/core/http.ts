import type {IncomingMessage, ServerResponse} from "node:http";
import {extname, normalize, resolve, sep} from "node:path";
import {readFile, stat} from "node:fs/promises";
import type {AuthInput, JsonObject, JsonValue} from "./types.js";

const CONTENT_TYPES: Record<string, string> = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml"
};

export function applySecurityHeaders(response: ServerResponse): void {
    response.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self'; font-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=()");
}

export function sendJson(response: ServerResponse, status: number, value: JsonValue): void {
    const body = JSON.stringify(value);
    response.writeHead(status, {
        "Cache-Control": "no-store",
        "Content-Length": Buffer.byteLength(body),
        "Content-Type": "application/json; charset=utf-8"
    });
    response.end(body);
}

export async function readJson(request: IncomingMessage): Promise<AuthInput> {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > 65_536) {
            throw new Error("Request body is too large");
        }
        chunks.push(buffer);
    }
    if (chunks.length === 0) {
        return {};
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Request body must be an object");
    }
    return parsed as AuthInput;
}

export function cookies(request: IncomingMessage): Record<string, string> {
    const header = request.headers.cookie ?? "";
    return Object.fromEntries(header.split(";").flatMap(part => {
        const separator = part.indexOf("=");
        if (separator < 1) {
            return [];
        }
        return [[part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())]];
    }));
}

export function cookie(name: string, value: string, maxAge: number, secure: boolean): string {
    const flags = [
        `${name}=${encodeURIComponent(value)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        `Max-Age=${maxAge}`
    ];
    if (secure) {
        flags.push("Secure");
    }
    return flags.join("; ");
}

export async function serveStatic(response: ServerResponse, publicRoot: string, requestPath: string): Promise<boolean> {
    const requested = requestPath === "/" ? "/index.html" : requestPath;
    const relative = normalize(decodeURIComponent(requested)).replace(/^[/\\]+/, "");
    const target = resolve(publicRoot, relative);
    const root = resolve(publicRoot) + sep;
    if (!target.startsWith(root)) {
        return false;
    }
    try {
        const details = await stat(target);
        if (!details.isFile()) {
            return false;
        }
        const body = await readFile(target);
        response.writeHead(200, {
            "Cache-Control": requestPath === "/" ? "no-cache" : "public, max-age=300",
            "Content-Length": body.length,
            "Content-Type": CONTENT_TYPES[extname(target)] ?? "application/octet-stream"
        });
        response.end(body);
        return true;
    } catch {
        return false;
    }
}

export function jsonObject(entries: Record<string, JsonValue>): JsonObject {
    return entries;
}

