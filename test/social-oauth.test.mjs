import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/social-oauth.js";
import {challenge, testContext} from "./support.mjs";

test("OAuth handoff validates the original state", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com", provider: "github"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.state});

    assert.equal(verification.ok, true);
    assert.equal(draft.publicData.provider, "github");
});
