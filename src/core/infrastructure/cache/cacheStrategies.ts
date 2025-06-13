// Advanced caching strategies

import { CacheKeys, CacheTTL, cacheHelper } from '@/lib/cache';
import { logger, performanceMonitor } from '@/lib/monitoring';

interface CacheStrategy {
  name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

// Cache-Aside Strategy (Lazy Loading)
export class CacheAsideStrategy implements CacheStrategy {
  name = 'cache-aside';

  async get<T>(key: string): Promise<T | null> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.get`);
    
    try {
      const cached = await cacheHelper.cached(
        key,
        async () => {
          throw new Error('Cache miss - use external fetcher');
        },
        0 // Don't cache miss
      );
      
      return cached as T;
    } catch (error) {
      return null; // Cache miss
    } finally {
      endTimer();
    }
  }

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.set`);
    
    try {
      // Manually store in cache
      const redis = await this.getRedisClient();
      
      // Store in memory cache
      const memoryCache = cacheHelper['cache'];
      memoryCache.set(key, value, ttl);
      
      // Store in Redis if available
      if (redis?.isReady()) {
        await redis.set(key, JSON.stringify(value), Math.floor(ttl / 1000));
      }
      
      await logger.debug(`Cache aside set: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Cache aside set error: ${key}`, error as Error, 'CacheStrategy');
    } finally {
      endTimer();
    }
  }

  async delete(key: string): Promise<void> {
    await cacheHelper.invalidate(key);
  }

  async invalidate(pattern: string): Promise<void> {
    await cacheHelper.invalidatePattern(pattern);
  }

  private async getRedisClient() {
    try {
      const { redis } = await import('@/lib/redis');
      return redis;
    } catch {
      return null;
    }
  }
}

// Write-Through Strategy
export class WriteThroughStrategy implements CacheStrategy {
  name = 'write-through';
  private dbWriter: (key: string, value: any) => Promise<void>;

  constructor(dbWriter: (key: string, value: any) => Promise<void>) {
    this.dbWriter = dbWriter;
  }

  async get<T>(key: string): Promise<T | null> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.get`);
    
    try {
      return await cacheHelper.cached(
        key,
        async () => {
          throw new Error('Cache miss - data should be loaded via write-through');
        },
        0
      ) as T;
    } catch {
      return null;
    } finally {
      endTimer();
    }
  }

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.set`);
    
    try {
      // Write to database first
      await this.dbWriter(key, value);
      
      // Then update cache
      await this.updateCache(key, value, ttl);
      
      await logger.debug(`Write-through set: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Write-through set error: ${key}`, error as Error, 'CacheStrategy');
      throw error; // Re-throw to indicate failure
    } finally {
      endTimer();
    }
  }

  async delete(key: string): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.delete`);
    
    try {
      // Delete from database first
      await this.dbWriter(key, null);
      
      // Then remove from cache
      await cacheHelper.invalidate(key);
      
      await logger.debug(`Write-through delete: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Write-through delete error: ${key}`, error as Error, 'CacheStrategy');
      throw error;
    } finally {
      endTimer();
    }
  }

  async invalidate(pattern: string): Promise<void> {
    await cacheHelper.invalidatePattern(pattern);
  }

  private async updateCache<T>(key: string, value: T, ttl: number): Promise<void> {
    const redis = await this.getRedisClient();
    
    // Store in memory cache
    const memoryCache = cacheHelper['cache'];
    memoryCache.set(key, value, ttl);
    
    // Store in Redis if available
    if (redis?.isReady()) {
      await redis.set(key, JSON.stringify(value), Math.floor(ttl / 1000));
    }
  }

  private async getRedisClient() {
    try {
      const { redis } = await import('@/lib/redis');
      return redis;
    } catch {
      return null;
    }
  }
}

// Write-Behind (Write-Back) Strategy
export class WriteBehindStrategy implements CacheStrategy {
  name = 'write-behind';
  private dbWriter: (operations: Array<{ key: string; value: any; operation: 'set' | 'delete' }>) => Promise<void>;
  private writeQueue: Array<{ key: string; value: any; operation: 'set' | 'delete'; timestamp: number }> = [];
  private flushInterval: number;
  private maxQueueSize: number;
  private intervalId?: NodeJS.Timeout;

  constructor(
    dbWriter: (operations: Array<{ key: string; value: any; operation: 'set' | 'delete' }>) => Promise<void>,
    options: {
      flushInterval?: number; // milliseconds
      maxQueueSize?: number;
    } = {}
  ) {
    this.dbWriter = dbWriter;
    this.flushInterval = options.flushInterval || 5000; // 5 seconds
    this.maxQueueSize = options.maxQueueSize || 100;
    
    this.startFlushTimer();
  }

  async get<T>(key: string): Promise<T | null> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.get`);
    
    try {
      return await cacheHelper.cached(
        key,
        async () => {
          throw new Error('Cache miss - data should be loaded separately');
        },
        0
      ) as T;
    } catch {
      return null;
    } finally {
      endTimer();
    }
  }

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.set`);
    
    try {
      // Update cache immediately
      await this.updateCache(key, value, ttl);
      
      // Queue write operation
      this.queueWrite(key, value, 'set');
      
      await logger.debug(`Write-behind set: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Write-behind set error: ${key}`, error as Error, 'CacheStrategy');
    } finally {
      endTimer();
    }
  }

  async delete(key: string): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.delete`);
    
    try {
      // Remove from cache immediately
      await cacheHelper.invalidate(key);
      
      // Queue delete operation
      this.queueWrite(key, null, 'delete');
      
      await logger.debug(`Write-behind delete: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Write-behind delete error: ${key}`, error as Error, 'CacheStrategy');
    } finally {
      endTimer();
    }
  }

  async invalidate(pattern: string): Promise<void> {
    await cacheHelper.invalidatePattern(pattern);
  }

  async flush(): Promise<void> {
    if (this.writeQueue.length === 0) return;

    const operations = [...this.writeQueue];
    this.writeQueue = [];

    try {
      await this.dbWriter(operations);
      await logger.debug(`Write-behind flushed ${operations.length} operations`, 'CacheStrategy');
    } catch (error) {
      await logger.error('Write-behind flush error', error as Error, 'CacheStrategy');
      // Re-queue failed operations
      this.writeQueue.unshift(...operations);
    }
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private queueWrite(key: string, value: any, operation: 'set' | 'delete'): void {
    // Remove existing operation for the same key
    this.writeQueue = this.writeQueue.filter(op => op.key !== key);
    
    // Add new operation
    this.writeQueue.push({
      key,
      value,
      operation,
      timestamp: Date.now(),
    });

    // Flush if queue is full
    if (this.writeQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  private startFlushTimer(): void {
    this.intervalId = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private async updateCache<T>(key: string, value: T, ttl: number): Promise<void> {
    const redis = await this.getRedisClient();
    
    // Store in memory cache
    const memoryCache = cacheHelper['cache'];
    memoryCache.set(key, value, ttl);
    
    // Store in Redis if available
    if (redis?.isReady()) {
      await redis.set(key, JSON.stringify(value), Math.floor(ttl / 1000));
    }
  }

  private async getRedisClient() {
    try {
      const { redis } = await import('@/lib/redis');
      return redis;
    } catch {
      return null;
    }
  }
}

// Refresh-Ahead Strategy
export class RefreshAheadStrategy implements CacheStrategy {
  name = 'refresh-ahead';
  private dataLoader: (key: string) => Promise<any>;
  private refreshThreshold: number; // Percentage of TTL when to refresh

  constructor(
    dataLoader: (key: string) => Promise<any>,
    refreshThreshold: number = 0.8 // Refresh when 80% of TTL has passed
  ) {
    this.dataLoader = dataLoader;
    this.refreshThreshold = refreshThreshold;
  }

  async get<T>(key: string): Promise<T | null> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.get`);
    
    try {
      const redis = await this.getRedisClient();
      
      // Check if we need to refresh
      if (redis?.isReady()) {
        const ttl = await redis.ttl(key);
        const originalTtl = CacheTTL.MEDIUM / 1000; // Convert to seconds
        
        if (ttl > 0 && ttl < (originalTtl * (1 - this.refreshThreshold))) {
          // Background refresh without blocking
          this.backgroundRefresh(key).catch(error => {
            logger.error(`Background refresh failed for key: ${key}`, error as Error, 'CacheStrategy');
          });
        }
      }
      
      return await cacheHelper.cached(
        key,
        () => this.dataLoader(key),
        CacheTTL.MEDIUM
      ) as T;
    } catch (error) {
      await logger.error(`Refresh-ahead get error: ${key}`, error as Error, 'CacheStrategy');
      return null;
    } finally {
      endTimer();
    }
  }

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    const endTimer = performanceMonitor.startTimer(`cache.${this.name}.set`);
    
    try {
      await this.updateCache(key, value, ttl);
      await logger.debug(`Refresh-ahead set: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Refresh-ahead set error: ${key}`, error as Error, 'CacheStrategy');
    } finally {
      endTimer();
    }
  }

  async delete(key: string): Promise<void> {
    await cacheHelper.invalidate(key);
  }

  async invalidate(pattern: string): Promise<void> {
    await cacheHelper.invalidatePattern(pattern);
  }

  private async backgroundRefresh(key: string): Promise<void> {
    try {
      const freshData = await this.dataLoader(key);
      await this.updateCache(key, freshData, CacheTTL.MEDIUM);
      await logger.debug(`Background refreshed: ${key}`, 'CacheStrategy');
    } catch (error) {
      await logger.error(`Background refresh error: ${key}`, error as Error, 'CacheStrategy');
    }
  }

  private async updateCache<T>(key: string, value: T, ttl: number): Promise<void> {
    const redis = await this.getRedisClient();
    
    // Store in memory cache
    const memoryCache = cacheHelper['cache'];
    memoryCache.set(key, value, ttl);
    
    // Store in Redis if available
    if (redis?.isReady()) {
      await redis.set(key, JSON.stringify(value), Math.floor(ttl / 1000));
    }
  }

  private async getRedisClient() {
    try {
      const { redis } = await import('@/lib/redis');
      return redis;
    } catch {
      return null;
    }
  }
}

// Cache Strategy Factory
export class CacheStrategyFactory {
  static createCacheAside(): CacheAsideStrategy {
    return new CacheAsideStrategy();
  }

  static createWriteThrough(dbWriter: (key: string, value: any) => Promise<void>): WriteThroughStrategy {
    return new WriteThroughStrategy(dbWriter);
  }

  static createWriteBehind(
    dbWriter: (operations: Array<{ key: string; value: any; operation: 'set' | 'delete' }>) => Promise<void>,
    options?: { flushInterval?: number; maxQueueSize?: number }
  ): WriteBehindStrategy {
    return new WriteBehindStrategy(dbWriter, options);
  }

  static createRefreshAhead(
    dataLoader: (key: string) => Promise<any>,
    refreshThreshold?: number
  ): RefreshAheadStrategy {
    return new RefreshAheadStrategy(dataLoader, refreshThreshold);
  }
}

// Context-specific cache strategies

export const categoryCacheStrategy = CacheStrategyFactory.createCacheAside();

export const userCacheStrategy = CacheStrategyFactory.createWriteThrough(
  async (key: string, value: any) => {
    const userId = key.replace('user:', '');
    // Update user in database
    const dbConnect = (await import('@/lib/mongodb')).default;
    const User = (await import('@/models/User')).default;
    
    await dbConnect();
    if (value === null) {
      await User.findByIdAndDelete(userId);
    } else {
      await User.findByIdAndUpdate(userId, value, { upsert: true });
    }
  }
);

// Strategies are already exported above 
