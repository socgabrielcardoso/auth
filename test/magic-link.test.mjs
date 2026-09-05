import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/magic-link.js";
import {challenge, testContext} from "./support.mjs";

test("magic link validates its signed payload", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.preview});

    assert.equal(verification.ok, true);
    assert.equal(typeof draft.publicData.preview, "string");
});
