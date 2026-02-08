import { Injectable, OnModuleDestroy } from '@nestjs/common';

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

@Injectable()
export class TtlCacheService implements OnModuleDestroy {
    private cache = new Map<string, CacheEntry<unknown>>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(private readonly ttlMs: number = 60 * 60 * 1000) {
        this.startCleanupTimer();
    }

    set<T>(key: string, value: T, customTtlMs?: number): void {
        const ttl = customTtlMs || this.ttlMs;
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttl,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;
        
        if (!entry) return null;
        
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.value;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    private startCleanupTimer(): void {
        // Clean up expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.cache.entries()) {
                if (now > entry.expiresAt) {
                    this.cache.delete(key);
                }
            }
        }, 5 * 60 * 1000);
    }

    onModuleDestroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}