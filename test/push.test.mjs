import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/push.js";
import {challenge, testContext} from "./support.mjs";

test("push approval binds the decision to its nonce", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.action});

    assert.equal(verification.ok, true);
    assert.equal(typeof draft.publicData.nonce, "string");
});
