import test from "node:test";
import assert from "node:assert/strict";
import {ChallengeStore} from "../dist/core/store.js";
import {testContext} from "./support.mjs";

test("signed values reject tampering", () => {
    const context = testContext();
    const token = context.sign("session-value");

    assert.equal(context.verifySigned(token), "session-value");
    assert.equal(context.verifySigned(`${token}x`), null);
});

test("challenge store enforces attempts and completion", () => {
    const context = testContext();
    const store = new ChallengeStore(context);
    const created = store.create("password", {
        state: {identity: "gabriel@example.com"},
        publicData: {},
        ttlMs: 60000,
        attempts: 2
    });

    assert.equal(store.get(created.challengeId, "password")?.attemptsRemaining, 2);
    assert.equal(store.fail(created.challengeId), 1);
    store.complete(created.challengeId);
    assert.equal(store.get(created.challengeId, "password"), null);
});
