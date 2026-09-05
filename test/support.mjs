import {createMethodContext} from "../dist/core/context.js";

export function testContext() {
    return createMethodContext({
        secret: "auth-14-test-secret",
        demoMode: true,
        clock: () => Date.parse("2026-09-05T12:00:00Z")
    });
}

export function challenge(method, draft) {
    const now = Date.parse("2026-09-05T12:00:00Z");
    return {
        id: "challenge-test",
        methodId: method.descriptor.id,
        state: draft.state,
        createdAt: now,
        expiresAt: now + draft.ttlMs,
        attemptsRemaining: draft.attempts
    };
}
