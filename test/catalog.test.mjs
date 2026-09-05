import test from "node:test";
import assert from "node:assert/strict";
import {access} from "node:fs/promises";
import {loadMethods} from "../dist/core/loader.js";

test("catalog exposes fourteen ordered and unique methods", async () => {
    const methods = await loadMethods();
    const descriptors = [...methods.values()].map(method => method.descriptor).sort((left, right) => left.order - right.order);

    assert.equal(methods.size, 14);
    assert.deepEqual(descriptors.map(method => method.order), Array.from({length: 14}, (_, index) => index + 1));
    assert.equal(new Set(descriptors.map(method => method.id)).size, 14);

    await Promise.all(descriptors.map(method => access(new URL(`../public/methods/${method.id}.js`, import.meta.url))));
});
