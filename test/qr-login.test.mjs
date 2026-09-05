import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/qr-login.js";
import {challenge, testContext} from "./support.mjs";

test("QR login expires quickly and accepts its pairing decision", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "mobile-session"});
    const verification = await method.verify(context, challenge(method, draft), {value: "pair"});

    assert.equal(draft.ttlMs, 90000);
    assert.equal(verification.ok, true);
});
