import {requireIdentity, maskIdentity, stringValue} from "../core/input.js";
import {result, stateString} from "../core/patterns.js";
import type {AuthMethod} from "../core/types.js";

const method: AuthMethod = {
    descriptor: {
        id: "adaptive-mfa",
        order: 14,
        name: "Adaptive MFA",
        category: "Risk orchestration",
        summary: "A contextual flow that changes factor strength and code length according to a deterministic risk score.",
        assurance: "adaptive",
        accent: "#f05f79"
    },
    async start(context, input) {
        const identity = requireIdentity(input);
        const fingerprint = Number.parseInt(context.digest(identity).slice(0, 2), 16);
        const riskScore = 30 + fingerprint % 66;
        const elevated = riskScore >= 70;
        const digits = elevated ? 8 : 6;
        const code = context.randomDigits(digits);
        return {
            state: {identity, expected: context.digest(code), riskScore},
            publicData: {
                identity: maskIdentity(identity),
                riskScore,
                riskBand: elevated ? "Elevated" : "Normal",
                factor: elevated ? "Step-up verification code" : "Verification code",
                digits,
                ...(context.demoMode ? {preview: code} : {})
            },
            ttlMs: elevated ? 90_000 : 180_000,
            attempts: elevated ? 3 : 5
        };
    },
    async verify(context, challenge, input) {
        const value = stringValue(input, "value", 16).replace(/\s/g, "");
        const valid = context.safeEqual(context.digest(value), stateString(challenge, "expected"));
        return result(valid, stateString(challenge, "identity"), "Adaptive challenge confirmed", "Adaptive challenge rejected");
    }
};

export default method;
