import {
    createHash,
    createHmac,
    randomBytes,
    randomInt,
    scryptSync,
    timingSafeEqual
} from "node:crypto";
import type {MethodContext} from "./types.js";

export interface ContextOptions {
    secret?: string;
    demoMode?: boolean;
    clock?: () => number;
}
export function createMethodContext(options: ContextOptions = {}): MethodContext {
    const masterSecret = options.secret ?? process.env.AUTH_SECRET ?? randomBytes(32).toString("hex");
    const demoMode = options.demoMode ?? process.env.NODE_ENV !== "production";
    const clock = options.clock ?? Date.now;

    return {
        demoMode,
        now: clock,
        randomDigits(length) {
            let value = "";
            for (let index = 0; index < length; index++) {
                value += randomInt(0, 10).toString();
            }
            return value;
        },
        randomToken(bytes = 24) {
            return randomBytes(bytes).toString("base64url");
        },
        digest(value) {
            return createHash("sha256").update(value).digest("hex");
        },
        safeEqual(left, right) {
            const leftBuffer = Buffer.from(left);
            const rightBuffer = Buffer.from(right);
            return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
        },
        scopedSecret(scope, identity) {
            return createHmac("sha256", masterSecret).update(`${scope}|${identity}`).digest("hex");
        },
        hashSecret(value, salt) {
            return scryptSync(value, salt, 32).toString("hex");
        },
        verifySecret(value, salt, expected) {
            const actual = scryptSync(value, salt, 32).toString("hex");
            const actualBuffer = Buffer.from(actual, "hex");
            const expectedBuffer = Buffer.from(expected, "hex");
            return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
        },
        sign(value) {
            const payload = Buffer.from(value).toString("base64url");
            const signature = createHmac("sha256", masterSecret).update(payload).digest("base64url");
            return `${payload}.${signature}`;
        },
        verifySigned(token) {
            const separator = token.lastIndexOf(".");
            if (separator < 1) {
                return null;
            }
            const payload = token.slice(0, separator);
            const signature = token.slice(separator + 1);
            const expected = createHmac("sha256", masterSecret).update(payload).digest("base64url");
            if (!this.safeEqual(signature, expected)) {
                return null;
            }
            try {
                return Buffer.from(payload, "base64url").toString("utf8");
            } catch {
                return null;
            }
        },
        totp(secret, time = clock()) {
            const counter = BigInt(Math.floor(time / 30_000));
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64BE(counter);
            const digest = createHmac("sha1", Buffer.from(secret, "hex")).update(buffer).digest();
            const offset = digest[digest.length - 1]! & 0x0f;
            const binary = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
            return binary.toString().padStart(6, "0");
        },
        browserProof(challenge, action) {
            return createHash("sha256").update(`${challenge}|${action}`).digest("hex");
        }
    };
}
