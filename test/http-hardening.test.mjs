import test from "node:test";
import assert from "node:assert/strict";
import {cookies, cookie, serveStatic} from "../dist/core/http.js";
import {testContext} from "./support.mjs";

const request = value => ({headers:{cookie:value}});

test("Correctly decode valid percent-encoded cookie values", async () => {
    assert.equal(cookies(request("session=a%2Fb")).session,"a/b");
});

test("Skip malformed encoded cookies without crashing", async () => {
    assert.equal(cookies(request("bad=%ZZ; valid=ok")).valid,"ok");
});

