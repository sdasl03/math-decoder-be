import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClockService } from '../clock.service';

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

@Injectable()
export class TtlCacheService implements OnModuleDestroy {
    private cache = new Map<string, CacheEntry<unknown>>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(
        private readonly clock: ClockService,
        private readonly ttlMs: number = 60 * 60 * 1000
    ) {
        this.startCleanupTimer();
    }

    set<T>(key: string, value: T, customTtlMs?: number): void {
        const ttl = customTtlMs || this.ttlMs;
        this.cache.set(key, {
            value,
            expiresAt: this.clock.currentTimeMs() + ttl,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;
        
        if (!entry) return null;
        
        if (this.clock.currentTimeMs() > entry.expiresAt) {
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
            const now = this.clock.currentTimeMs();
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