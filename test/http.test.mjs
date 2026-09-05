import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";

test("HTTP flow creates a verified session", async context => {
    const port = 43147;
    const origin = `http://127.0.0.1:${port}`;
    const server = spawn(process.execPath, ["dist/server.js"], {
        env: {...process.env, PORT: String(port), HOST: "127.0.0.1", AUTH_SECRET: "http-test-secret"},
        stdio: ["ignore", "pipe", "pipe"]
    });
    context.after(() => server.kill());
    await waitUntilReady(origin, server);

    const csrfResponse = await fetch(`${origin}/api/csrf`);
    const csrf = await csrfResponse.json();
    const csrfCookie = csrfResponse.headers.getSetCookie()[0].split(";", 1)[0];
    const methods = await fetch(`${origin}/api/methods`).then(response => response.json());

    assert.equal(methods.length, 14);

    const startResponse = await fetch(`${origin}/api/methods/password/start`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-CSRF-Token": csrf.token, Cookie: csrfCookie},
        body: JSON.stringify({identity: "gabriel@example.com"})
    });
    const challenge = await startResponse.json();

    assert.equal(startResponse.status, 201);

    const verifyResponse = await fetch(`${origin}/api/methods/password/verify`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "X-CSRF-Token": csrf.token, Cookie: csrfCookie},
        body: JSON.stringify({challengeId: challenge.challengeId, value: challenge.data.preview})
    });
    const verification = await verifyResponse.json();
    const sessionCookie = verifyResponse.headers.getSetCookie()[0].split(";", 1)[0];
    const session = await fetch(`${origin}/api/session`, {headers: {Cookie: sessionCookie}}).then(response => response.json());

    assert.equal(verification.ok, true);
    assert.equal(session.authenticated, true);
    assert.equal(session.method, "password");
});

async function waitUntilReady(origin, server) {
    for (let attempt = 0; attempt < 30; attempt++) {
        if (server.exitCode !== null) {
            throw new Error("Server stopped before becoming ready");
        }
        try {
            const response = await fetch(`${origin}/api/health`);
            if (response.ok) {
                return;
            }
        } catch {
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error("Server did not become ready");
}
