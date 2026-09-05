import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/email-otp.js";
import {challenge, testContext} from "./support.mjs";

test("email OTP validates the issued code", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "gabriel@example.com"});
    const verification = await method.verify(context, challenge(method, draft), {value: draft.publicData.preview});

    assert.equal(verification.ok, true);
    assert.equal(draft.publicData.channel, "email");
});
