import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/security-key.js";
import {challenge, testContext} from "./support.mjs";

test("security key proof cannot be reused for another action", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const value = context.browserProof(draft.publicData.challenge, "passkey");
    const verification = await method.verify(context, challenge(method, draft), {value});

    assert.equal(verification.ok, false);
});
