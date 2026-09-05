export class RateLimiter {
    private readonly windows = new Map<string, {startedAt: number; count: number}>();

    constructor(private readonly now: () => number) {
    }

    allow(key: string, limit: number, windowMs: number): boolean {
        const current = this.now();
        const window = this.windows.get(key);
        if (!window || current - window.startedAt >= windowMs) {
            this.windows.set(key, {startedAt: current, count: 1});
            return true;
        }
        window.count += 1;
        return window.count <= limit;
    }
}

