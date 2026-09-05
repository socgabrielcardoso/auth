import {maskIdentity, requireIdentity, stringValue} from "./input.js";
import type {
    AuthInput,
    AuthMethod,
    ChallengeDraft,
    ChallengeRecord,
    JsonObject,
    MethodContext,
    MethodDescriptor,
    Verification
} from "./types.js";

interface CredentialConfig {
    descriptor: MethodDescriptor;
    environmentKey: string;
    demoSecret: string;
    label: string;
    requirements: string;
    attempts?: number;
}

interface CodeConfig {
    descriptor: MethodDescriptor;
    channel: string;
    digits: number;
    ttlMs: number;
}

interface DecisionConfig {
    descriptor: MethodDescriptor;
    action: string;
    ttlMs: number;
}

interface ProofConfig {
    descriptor: MethodDescriptor;
    action: string;
    capability: string;
}

interface FederatedConfig {
    descriptor: MethodDescriptor;
    providers: string[];
}

export function credentialMethod(config: CredentialConfig): AuthMethod {
    return {
        descriptor: config.descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const salt = context.randomToken(16);
            const configured = process.env[config.environmentKey];
            const expected = configured ?? (context.demoMode ? config.demoSecret : context.scopedSecret(config.descriptor.id, identity));
            return {
                state: {identity, salt, expected: context.hashSecret(expected, salt)},
                publicData: compact({
                    identity: maskIdentity(identity),
                    label: config.label,
                    requirements: config.requirements,
                    preview: context.demoMode ? expected : null
                }),
                ttlMs: 5 * 60_000,
                attempts: config.attempts ?? 5
            };
        },
        async verify(context, challenge, input) {
            const value = stringValue(input, "value", 256);
            const salt = stateString(challenge, "salt");
            const expected = stateString(challenge, "expected");
            return result(
                context.verifySecret(value, salt, expected),
                stateString(challenge, "identity"),
                `${config.label} accepted`,
                `${config.label} did not match`
            );
        }
    };
}

export function codeMethod(config: CodeConfig): AuthMethod {
    return {
        descriptor: config.descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const code = context.randomDigits(config.digits);
            return {
                state: {identity, expected: context.digest(code)},
                publicData: compact({
                    identity: maskIdentity(identity),
                    channel: config.channel,
                    digits: config.digits,
                    preview: context.demoMode ? code : null
                }),
                ttlMs: config.ttlMs,
                attempts: 5
            };
        },
        async verify(context, challenge, input) {
            const value = stringValue(input, "value", 16).replace(/\s/g, "");
            const valid = context.safeEqual(context.digest(value), stateString(challenge, "expected"));
            return result(valid, stateString(challenge, "identity"), "Code confirmed", "Invalid code");
        }
    };
}

export function totpMethod(descriptor: MethodDescriptor): AuthMethod {
    return {
        descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const secret = context.scopedSecret(descriptor.id, identity);
            return {
                state: {identity, secret},
                publicData: compact({
                    identity: maskIdentity(identity),
                    period: 30,
                    digits: 6,
                    preview: context.demoMode ? context.totp(secret) : null
                }),
                ttlMs: 2 * 60_000,
                attempts: 5
            };
        },
        async verify(context, challenge, input) {
            const value = stringValue(input, "value", 12).replace(/\s/g, "");
            const secret = stateString(challenge, "secret");
            const valid = [-30_000, 0, 30_000].some(offset => context.safeEqual(value, context.totp(secret, context.now() + offset)));
            return result(valid, stateString(challenge, "identity"), "Authenticator code confirmed", "Authenticator code expired or invalid");
        }
    };
}

export function decisionMethod(config: DecisionConfig): AuthMethod {
    return {
        descriptor: config.descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const nonce = context.randomToken(12);
            const expected = context.digest(`${nonce}|${config.action}`);
            return {
                state: {identity, nonce, expected},
                publicData: {
                    identity: maskIdentity(identity),
                    nonce,
                    action: config.action
                },
                ttlMs: config.ttlMs,
                attempts: 3
            };
        },
        async verify(context, challenge, input) {
            const decision = stringValue(input, "value", 64);
            const nonce = stateString(challenge, "nonce");
            const valid = context.safeEqual(context.digest(`${nonce}|${decision}`), stateString(challenge, "expected"));
            return result(valid, stateString(challenge, "identity"), "Approval confirmed", "Approval was not confirmed");
        }
    };
}

export function signedLinkMethod(descriptor: MethodDescriptor): AuthMethod {
    return {
        descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const expiresAt = context.now() + 10 * 60_000;
            const token = context.sign(JSON.stringify({identity, method: descriptor.id, expiresAt, nonce: context.randomToken(10)}));
            return {
                state: {identity, expected: context.digest(token), expiresAt},
                publicData: compact({
                    identity: maskIdentity(identity),
                    preview: context.demoMode ? token : null
                }),
                ttlMs: 10 * 60_000,
                attempts: 3
            };
        },
        async verify(context, challenge, input) {
            const token = stringValue(input, "value", 2048);
            const payload = context.verifySigned(token);
            const valid = payload !== null
                && context.safeEqual(context.digest(token), stateString(challenge, "expected"))
                && stateNumber(challenge, "expiresAt") > context.now();
            return result(valid, stateString(challenge, "identity"), "Secure link confirmed", "Link is invalid or expired");
        }
    };
}

export function proofMethod(config: ProofConfig): AuthMethod {
    return {
        descriptor: config.descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const challenge = context.randomToken(32);
            return {
                state: {identity, expected: context.browserProof(challenge, config.action)},
                publicData: {
                    identity: maskIdentity(identity),
                    challenge,
                    action: config.action,
                    capability: config.capability
                },
                ttlMs: 2 * 60_000,
                attempts: 3
            };
        },
        async verify(context, challenge, input) {
            const proof = stringValue(input, "value", 128);
            const valid = context.safeEqual(proof, stateString(challenge, "expected"));
            return result(valid, stateString(challenge, "identity"), "Browser ceremony confirmed", "Browser proof was rejected");
        }
    };
}

export function federatedMethod(config: FederatedConfig): AuthMethod {
    return {
        descriptor: config.descriptor,
        async start(context, input) {
            const identity = requireIdentity(input);
            const provider = stringValue(input, "provider", 40);
            if (!config.providers.includes(provider)) {
                throw new Error("Choose a supported identity provider");
            }
            const state = context.randomToken(20);
            return {
                state: {identity, provider, expected: context.digest(state)},
                publicData: compact({
                    identity: maskIdentity(identity),
                    provider,
                    state: context.demoMode ? state : null
                }),
                ttlMs: 5 * 60_000,
                attempts: 3
            };
        },
        async verify(context, challenge, input) {
            const state = stringValue(input, "value", 256);
            const valid = context.safeEqual(context.digest(state), stateString(challenge, "expected"));
            return result(valid, stateString(challenge, "identity"), "Identity provider confirmed", "Identity provider state mismatch");
        }
    };
}

export function challengeDraft(
    state: JsonObject,
    publicData: JsonObject,
    ttlMs = 5 * 60_000,
    attempts = 5
): ChallengeDraft {
    return {state, publicData, ttlMs, attempts};
}

export function stateString(challenge: ChallengeRecord, name: string): string {
    const value = challenge.state[name];
    return typeof value === "string" ? value : "";
}

export function stateNumber(challenge: ChallengeRecord, name: string): number {
    const value = challenge.state[name];
    return typeof value === "number" ? value : 0;
}

export function result(valid: boolean, subject: string, accepted: string, rejected: string): Verification {
    return valid ? {ok: true, message: accepted, subject} : {ok: false, message: rejected};
}

function compact(values: JsonObject): JsonObject {
    return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== null));
}
