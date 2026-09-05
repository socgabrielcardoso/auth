import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/sms-otp.js";
import {challenge, testContext} from "./support.mjs";

test("SMS OTP rejects an unrelated code", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "+5511999999999"});
    const verification = await method.verify(context, challenge(method, draft), {value: "000000"});

    assert.equal(verification.ok, false);
    assert.equal(draft.ttlMs, 180000);
});
