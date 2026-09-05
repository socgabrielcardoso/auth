export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface JsonObject {
    [key: string]: JsonValue;
}
export type AuthInput = Record<string, unknown>;

export interface MethodDescriptor {
    id: string;
    order: number;
    name: string;
    category: string;
    summary: string;
    assurance: "foundational" | "standard" | "strong" | "adaptive";
    accent: string;
}

export interface ChallengeDraft {
    state: JsonObject;
    publicData: JsonObject;
    ttlMs: number;
    attempts: number;
}

export interface ChallengeRecord {
    id: string;
    methodId: string;
    state: JsonObject;
    createdAt: number;
    expiresAt: number;
    attemptsRemaining: number;
}

export interface PublicChallenge {
    challengeId: string;
    methodId: string;
    expiresAt: number;
    attemptsRemaining: number;
    data: JsonObject;
}

export interface Verification {
    ok: boolean;
    message: string;
    subject?: string;
    data?: JsonObject;
}

export interface MethodContext {
    readonly demoMode: boolean;
    now(): number;
    randomDigits(length: number): string;
    randomToken(bytes?: number): string;
    digest(value: string): string;
    safeEqual(left: string, right: string): boolean;
    scopedSecret(scope: string, identity: string): string;
    hashSecret(value: string, salt: string): string;
    verifySecret(value: string, salt: string, expected: string): boolean;
    sign(value: string): string;
    verifySigned(token: string): string | null;
    totp(secret: string, time?: number): string;
    browserProof(challenge: string, action: string): string;
}

export interface AuthMethod {
    descriptor: MethodDescriptor;
    start(context: MethodContext, input: AuthInput): Promise<ChallengeDraft>;
    verify(context: MethodContext, challenge: ChallengeRecord, input: AuthInput): Promise<Verification>;
}
