// Caching utilities for performance optimization

interface IRedisClient {
    isReady: () => boolean;
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string, ttl: number) => Promise<void>;
    del: (key: string) => Promise<void>;
    deletePattern: (pattern: string) => Promise<void>;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  serialize?: boolean; // Whether to serialize objects
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class MemoryCache {
  private static instance: MemoryCache;
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout;

  private constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 1000;
    
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  static getInstance(options?: CacheOptions): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache(options);
    }
    return MemoryCache.instance;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private evictOldest(): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.evictOldest();
    
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  keys(): IterableIterator<string> {
    return this.cache.keys();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRatio: number;
    entries: Array<{ key: string; hits: number; age: number }>;
  } {
    const now = Date.now();
    const entries: Array<{ key: string; hits: number; age: number }> = [];
    let totalHits = 0;
    let totalRequests = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      entries.push({ key, hits: entry.hits, age });
      totalHits += entry.hits;
      totalRequests += entry.hits > 0 ? entry.hits : 1;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRatio: totalRequests > 0 ? totalHits / totalRequests : 0,
      entries: entries.sort((a, b) => b.hits - a.hits),
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Cache key generators
export const CacheKeys = {
  // Careers
  careers: (filters: Record<string, string | number | boolean> = {}) => {
    const sortedKeys = Object.keys(filters).sort();
    const filterString = sortedKeys
      .map(key => `${key}:${filters[key]}`)
      .join('|');
    return `careers:${filterString}`;
  },
  
  career: (id: string) => `career:${id}`,
  
  careersByPersonality: (personalityType: string) => `careers:personality:${personalityType}`,
  
  // Personality Types
  personalityTypes: () => 'personality-types',
  
  personalityType: (code: string) => `personality-type:${code}`,
  
  // Test Results
  testResult: (userId: string) => `test-result:${userId}`,
  
  // Users
  user: (id: string) => `user:${id}`,
  
  userProfile: (username: string) => `user:profile:${username}`,
  
  // Statistics
  stats: (type: string, period?: string) => `stats:${type}${period ? `:${period}` : ''}`,
};

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  VERY_SHORT: 1 * 60 * 1000,      // 1 minute
  SHORT: 5 * 60 * 1000,           // 5 minutes
  MEDIUM: 15 * 60 * 1000,         // 15 minutes
  LONG: 60 * 60 * 1000,           // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// Multi-tier cache helper functions
export class CacheHelper {
  private cache: MemoryCache;
  private useRedis: boolean;

  constructor() {
    this.cache = MemoryCache.getInstance();
    this.useRedis = process.env.NODE_ENV === 'production' && 
                   (!!process.env.REDIS_URL || !!process.env.REDIS_HOST);
  }

  private async getRedisClient(): Promise<IRedisClient | null> {
    if (!this.useRedis) return null;
    
    try {
      const { redis } = await import('@/core/infrastructure/cache/redis');
      return redis as unknown as IRedisClient;
    } catch {
      return null;
    }
  }

  // Generic cache wrapper with multi-tier support
  async cached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CacheTTL.MEDIUM
  ): Promise<T> {
    // Level 1: Try memory cache first
    const memoryCached = this.cache.get<T>(key);
    if (memoryCached !== null) {
      return memoryCached;
    }

    // Level 2: Try Redis cache
    const redis = await this.getRedisClient();
    if (redis && redis.isReady()) {
      try {
        const redisCached = await redis.get(key);
        if (redisCached) {
          const data = JSON.parse(redisCached) as T;
          // Store back in memory cache for faster access
          this.cache.set(key, data, ttl);
          return data;
        }
      } catch {
        // Redis error, continue to fetcher
      }
    }

    // Level 3: Fetch fresh data
    const data = await fetcher();
    
    // Store in both caches
    this.cache.set(key, data, ttl);
    
    if (redis && redis.isReady()) {
      try {
        await redis.set(key, JSON.stringify(data), Math.floor(ttl / 1000));
      } catch {
        // Redis error, continue (memory cache still works)
      }
    }
    
    return data;
  }

  // Cache invalidation helpers
  async invalidate(key: string): Promise<boolean> {
    const memoryResult = this.cache.delete(key);
    
    const redis = await this.getRedisClient();
    if (redis && redis.isReady()) {
      try {
        await redis.del(key);
      } catch {
        // Redis error, but memory cache was cleared
      }
    }
    
    return memoryResult;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // Invalidate memory cache
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));

    // Invalidate Redis cache
    const redis = await this.getRedisClient();
    if (redis && redis.isReady()) {
      try {
        await redis.deletePattern(pattern);
      } catch {
        // Redis error, but memory cache was cleared
      }
    }
  }

  // Bulk operations
  setBulk<T>(entries: Array<{ key: string; value: T; ttl?: number }>): void {
    entries.forEach(({ key, value, ttl }) => {
      this.cache.set(key, value, ttl);
    });
  }

  getBulk<T>(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>();
    keys.forEach(key => {
      result.set(key, this.cache.get<T>(key));
    });
    return result;
  }

  // Cache warming
  async warmCache<T>(
    entries: Array<{
      key: string;
      fetcher: () => Promise<T>;
      ttl?: number;
    }>
  ): Promise<void> {
    const promises = entries.map(async ({ key, fetcher, ttl }) => {
      try {
        const data = await fetcher();
        this.cache.set(key, data, ttl);
      } catch (error) {
        console.error(`Failed to warm cache for key ${key}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  // Statistics
  getStats() {
    return this.cache.getStats();
  }

  // Public set method
  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, ttl);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Request-level caching for API responses
export function withResponseCache<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  cacheKeyFn: (...args: T) => string,
  ttl: number = CacheTTL.MEDIUM
) {
  const cacheHelper = new CacheHelper();
  
  return async (...args: T): Promise<R> => {
    const cacheKey = cacheKeyFn(...args);
    
    return cacheHelper.cached(
      cacheKey,
      () => handler(...args),
      ttl
    );
  };
}

// Database query caching
export function withQueryCache<T>(
  query: () => Promise<T>,
  cacheKey: string,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  const cacheHelper = new CacheHelper();
  return cacheHelper.cached(cacheKey, query, ttl);
}

// Background refresh for hot data
export class BackgroundRefresher {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private cacheHelper: CacheHelper;

  constructor() {
    this.cacheHelper = new CacheHelper();
  }

  startRefresh<T>(
    key: string,
    fetcher: () => Promise<T>,
    interval: number,
    ttl: number = CacheTTL.LONG
  ): void {
    // Initial fetch
    this.refreshData(key, fetcher, ttl);
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      this.refreshData(key, fetcher, ttl);
    }, interval);
    
    this.intervals.set(key, intervalId);
  }

  stopRefresh(key: string): void {
    const intervalId = this.intervals.get(key);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(key);
    }
  }

  private async refreshData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.cacheHelper.set(key, data, ttl);
    } catch (error) {
      console.error(`Failed to refresh cache for key ${key}:`, error);
    }
  }

  stopAll(): void {
    for (const [, intervalId] of this.intervals.entries()) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
  }
}

// Smart caching decorator for class methods
export function Cached(ttl: number = CacheTTL.MEDIUM) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheHelper = new CacheHelper();

    descriptor.value = async function (this: object, ...args: unknown[]) {
      const cacheKey = `${(this as { constructor: { name: string } }).constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      
      return cacheHelper.cached(
        cacheKey,
        () => originalMethod.apply(this, args),
        ttl
      );
    };

    return descriptor;
  };
}

// Export singleton instances
export const memoryCache = MemoryCache.getInstance();
export const cacheHelper = new CacheHelper();
export const backgroundRefresher = new BackgroundRefresher();

// Setup cache warming for common data
/*
// export async function warmCommonCaches(): Promise<void> {
  try {
    await cacheHelper.warmCache([
      {
        key: CacheKeys.personalityTypes(),
        fetcher: async () => {
          const { default: PersonalityType } = await import('@/core/domain/entities/PersonalityType');
          return PersonalityType.find({}).lean();
        },
        ttl: CacheTTL.VERY_LONG,
      },
    ]);
  } catch (error) {
    console.error('Failed to warm common caches:', error);
  }
}
*/ 
