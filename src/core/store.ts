import type {ChallengeDraft, ChallengeRecord, PublicChallenge} from "./types.js";
import type {MethodContext} from "./types.js";

export class ChallengeStore {
    private readonly records = new Map<string, ChallengeRecord>();

    constructor(private readonly context: MethodContext) {
    }

    create(methodId: string, draft: ChallengeDraft): PublicChallenge {
        this.clearExpired();
        const id = this.context.randomToken(18);
        const createdAt = this.context.now();
        const record: ChallengeRecord = {
            id,
            methodId,
            state: draft.state,
            createdAt,
            expiresAt: createdAt + draft.ttlMs,
            attemptsRemaining: draft.attempts
        };
        this.records.set(id, record);
        return {
            challengeId: id,
            methodId,
            expiresAt: record.expiresAt,
            attemptsRemaining: record.attemptsRemaining,
            data: draft.publicData
        };
    }

    get(id: string, methodId: string): ChallengeRecord | null {
        const record = this.records.get(id);
        if (!record || record.methodId !== methodId || record.expiresAt <= this.context.now()) {
            if (record) {
                this.records.delete(id);
            }
            return null;
        }
        return record;
    }

    fail(id: string): number {
        const record = this.records.get(id);
        if (!record) {
            return 0;
        }
        record.attemptsRemaining -= 1;
        if (record.attemptsRemaining <= 0) {
            this.records.delete(id);
            return 0;
        }
        return record.attemptsRemaining;
    }

    complete(id: string): void {
        this.records.delete(id);
    }

    private clearExpired(): void {
        const now = this.context.now();
        for (const [id, record] of this.records) {
            if (record.expiresAt <= now) {
                this.records.delete(id);
            }
        }
    }
}
