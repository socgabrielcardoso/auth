import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/recovery-code.js";
import {challenge, testContext} from "./support.mjs";

test("recovery code is verified through a derived hash", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.preview});

    assert.equal(verification.ok, true);
    assert.notEqual(draft.state.expected, draft.publicData.preview);
});
