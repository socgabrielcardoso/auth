import test from "node:test";
import assert from "node:assert/strict";
import method from "../dist/methods/pin.js";
import {challenge, testContext} from "./support.mjs";

test("pin challenge limits verification attempts", async () => {
    const context = testContext();
    const draft = await method.start(context, {identity: "device-042"});

    assert.equal(draft.attempts, 3);
    assert.equal(draft.publicData.preview, "428615");
});
