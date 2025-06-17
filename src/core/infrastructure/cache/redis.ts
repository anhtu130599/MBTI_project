// Redis client setup and utilities

import { createClient, RedisClientType } from 'redis';
import { logger } from '@/lib/monitoring';

interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType | null = null;
  private isConnected = false;
  private config: RedisConfig;

  private constructor() {
    this.config = {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };
  }

  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected && this.client?.isReady) {
      return;
    }

    try {
      // Create Redis client
      if (this.config.url) {
        this.client = createClient({
          url: this.config.url,
        });
      } else {
        this.client = createClient({
          socket: {
            host: this.config.host,
            port: this.config.port,
          },
          password: this.config.password,
          database: this.config.db,
        });
      }

      // Error handling
      this.client.on('error', (err) => {
        logger.error('Redis client error', err, 'Redis');
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected', 'Redis');
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready', 'Redis');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected', 'Redis');
        this.isConnected = false;
      });

      // Connect to Redis
      await this.client.connect();
      
    } catch (error) {
      logger.error('Failed to connect to Redis', error as Error, 'Redis');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected && this.client?.isReady === true;
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    if (!this.isReady()) {
      await this.connect();
    }
    
    try {
      return await this.client!.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      if (ttlSeconds) {
        await this.client!.setEx(key, ttlSeconds, value);
      } else {
        await this.client!.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key: ${key}`, error as Error, 'Redis');
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const result = await this.client!.del(key);
      return result > 0;
    } catch (error) {
      logger.error(`Redis DEL error for key: ${key}`, error as Error, 'Redis');
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const result = await this.client!.exists(key);
      return result > 0;
    } catch (error) {
      logger.error(`Redis EXISTS error for key: ${key}`, error as Error, 'Redis');
      return false;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const result = await this.client!.expire(key, ttlSeconds);
      return result;
    } catch (error) {
      logger.error(`Redis EXPIRE error for key: ${key}`, error as Error, 'Redis');
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.ttl(key);
    } catch (error) {
      logger.error(`Redis TTL error for key: ${key}`, error as Error, 'Redis');
      return -1;
    }
  }

  // Advanced operations
  async mget(keys: string[]): Promise<(string | null)[]> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.mGet(keys);
    } catch (error) {
      logger.error(`Redis MGET error for keys: ${keys.join(', ')}`, error as Error, 'Redis');
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Record<string, string>): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      await this.client!.mSet(keyValuePairs);
      return true;
    } catch (error) {
      logger.error('Redis MSET error', error as Error, 'Redis');
      return false;
    }
  }

  async incr(key: string): Promise<number | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async decr(key: string): Promise<number | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.decr(key);
    } catch (error) {
      logger.error(`Redis DECR error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      await this.client!.hSet(key, field, value);
      return true;
    } catch (error) {
      logger.error(`Redis HSET error for key: ${key}, field: ${field}`, error as Error, 'Redis');
      return false;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const result = await this.client!.hGet(key, field);
      return result ?? null;
    } catch (error) {
      logger.error(`Redis HGET error for key: ${key}, field: ${field}`, error as Error, 'Redis');
      return null;
    }
  }

  async hgetall(key: string): Promise<Record<string, string> | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.hGetAll(key);
    } catch (error) {
      logger.error(`Redis HGETALL error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async hdel(key: string, field: string): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const result = await this.client!.hDel(key, field);
      return result > 0;
    } catch (error) {
      logger.error(`Redis HDEL error for key: ${key}, field: ${field}`, error as Error, 'Redis');
      return false;
    }
  }

  // List operations
  async lpush(key: string, value: string): Promise<number | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.lPush(key, value);
    } catch (error) {
      logger.error(`Redis LPUSH error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async rpush(key: string, value: string): Promise<number | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.rPush(key, value);
    } catch (error) {
      logger.error(`Redis RPUSH error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[] | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.lRange(key, start, stop);
    } catch (error) {
      logger.error(`Redis LRANGE error for key: ${key}`, error as Error, 'Redis');
      return null;
    }
  }

  async ltrim(key: string, start: number, stop: number): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      await this.client!.lTrim(key, start, stop);
      return true;
    } catch (error) {
      logger.error(`Redis LTRIM error for key: ${key}`, error as Error, 'Redis');
      return false;
    }
  }

  // Pattern operations
  async keys(pattern: string): Promise<string[]> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.keys(pattern);
    } catch (error) {
      logger.error(`Redis KEYS error for pattern: ${pattern}`, error as Error, 'Redis');
      return [];
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      
      return await this.client!.del(keys);
    } catch (error) {
      logger.error(`Redis DELETE PATTERN error for pattern: ${pattern}`, error as Error, 'Redis');
      return 0;
    }
  }

  // Ping
  async ping(): Promise<string | null> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      return await this.client!.ping();
    } catch (error) {
      logger.error('Redis PING error', error as Error, 'Redis');
      return null;
    }
  }

  // Flush
  async flushdb(): Promise<boolean> {
    if (!this.isReady()) {
      await this.connect();
    }

    try {
      await this.client!.flushDb();
      return true;
    } catch (error) {
      logger.error('Redis FLUSHDB error', error as Error, 'Redis');
      return false;
    }
  }
}

// Utility functions
export function isRedisAvailable(): boolean {
  return process.env.NODE_ENV === 'production' && 
         (!!process.env.REDIS_URL || !!process.env.REDIS_HOST);
}

export async function initializeRedis(): Promise<void> {
  if (isRedisAvailable()) {
    try {
      const redis = RedisClient.getInstance();
      await redis.connect();
      logger.info('Redis initialized successfully', 'Redis');
    } catch (error) {
      logger.error('Failed to initialize Redis', error as Error, 'Redis');
    }
  }
}

// Export singleton instance
export const redis = RedisClient.getInstance(); 
