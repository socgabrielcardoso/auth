import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/passkey.js";
import {challenge, testContext} from "./support.mjs";

test("passkey ceremony verifies a challenge-bound browser proof", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const value = context.browserProof(draft.publicData.challenge, draft.publicData.action);
    const verification = await method.verify(context, challenge(method, draft), {value});

    assert.equal(verification.ok, true);
});
