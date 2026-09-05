import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/adaptive-mfa.js";
import {challenge, testContext} from "./support.mjs";

test("adaptive MFA chooses and verifies a risk-based factor", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.preview});

    assert.equal(verification.ok, true);
    assert.ok([6, 8].includes(draft.publicData.digits));
    assert.ok(draft.publicData.riskScore >= 30);
});
