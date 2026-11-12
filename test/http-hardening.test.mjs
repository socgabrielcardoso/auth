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

test("Keep the first occurrence when session cookies collide", async () => {
    assert.equal(cookies(request("session=first; session=second")).session,"first");
});

test("Ignore empty cookie names after trimming", async () => {
    assert.equal(Object.keys(cookies(request(" =bad; safe=ok"))).length,1);
});

test("Do not materialize prototype-sensitive cookie names", async () => {
    const parsed=cookies(request("__proto__=bad; constructor=bad; safe=ok"));assert.equal(parsed.safe,"ok");assert.equal(Object.hasOwn(parsed,"__proto__"),false);
});

test("Reject malformed percent-encoded static paths", async () => {
    assert.equal(await serveStatic({}, ".", "/broken%ZZ"),false);
});

test("Reject invalid signed-cookie lifetime values", async () => {
    assert.throws(()=>cookie("session","abc",NaN,true),RangeError);
});

test("Reject invalid and oversized numeric OTP lengths", async () => {
    const ctx=testContext();assert.throws(()=>ctx.randomDigits(0),RangeError);assert.throws(()=>ctx.randomDigits(65),RangeError);
});

