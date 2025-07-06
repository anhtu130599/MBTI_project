// Database indexing optimization utilities

import { logger } from '@/lib/monitoring';
import dbConnect from '@/lib/mongodb';
import { Db, Document } from 'mongodb';

interface IndexDefinition {
  collectionName: string;
  indexName: string;
  keys: Record<string, 1 | -1 | 'text' | '2d' | '2dsphere'>;
  options?: {
    unique?: boolean;
    sparse?: boolean;
    background?: boolean;
    partialFilterExpression?: Document;
    expireAfterSeconds?: number;
    collation?: Document;
    weights?: Record<string, number>;
    default_language?: string;
    language_override?: string;
  };
}

interface IndexStat extends Document {
  name: string;
  accesses: {
    ops: number;
    since: Date;
  };
}

// Index definitions for all collections
const INDEX_DEFINITIONS: IndexDefinition[] = [


  // Users Collection
  {
    collectionName: 'users',
    indexName: 'users_username_unique',
    keys: { username: 1 },
    options: { unique: true },
  },
  {
    collectionName: 'users',
    indexName: 'users_email_unique',
    keys: { email: 1 },
    options: { unique: true, sparse: true },
  },
  {
    collectionName: 'users',
    indexName: 'users_role_active',
    keys: { role: 1, isActive: 1 },
    options: { background: true },
  },
  {
    collectionName: 'users',
    indexName: 'users_created_at',
    keys: { createdAt: -1 },
    options: { background: true },
  },

  // Careers Collection
  {
    collectionName: 'careers',
    indexName: 'careers_personality_types',
    keys: { personalityTypes: 1 },
    options: { background: true },
  },
  {
    collectionName: 'careers',
    indexName: 'careers_featured_title',
    keys: { featured: -1, title: 1 },
    options: { background: true },
  },
  {
    collectionName: 'careers',
    indexName: 'careers_salary_range',
    keys: { 'salary.min': 1, 'salary.max': 1 },
    options: { 
      background: true,
      sparse: true 
    },
  },
  {
    collectionName: 'careers',
    indexName: 'careers_skills',
    keys: { skills: 1 },
    options: { background: true },
  },
  {
    collectionName: 'careers',
    indexName: 'careers_work_environment',
    keys: { workEnvironment: 1 },
    options: { background: true },
  },
  {
    collectionName: 'careers',
    indexName: 'careers_text_search',
    keys: { 
      title: 'text', 
      description: 'text',
      skills: 'text',
      requirements: 'text'
    },
    options: {
      background: true,
      weights: {
        title: 10,
        description: 5,
        skills: 3,
        requirements: 2,
      },
      default_language: 'english',
    },
  },

  // Personality Detail Info Collection (personalitydetailinfos)
  {
    collectionName: 'personalitydetailinfos',
    indexName: 'personality_detail_type_unique',
    keys: { type: 1 },
    options: { unique: true },
  },
  {
    collectionName: 'personalitydetailinfos',
    indexName: 'personality_detail_name',
    keys: { name: 1 },
    options: { background: true },
  },

  // Test Results Collection
  {
    collectionName: 'testresults',
    indexName: 'test_results_user_unique',
    keys: { userId: 1 },
    options: { unique: true },
  },
  {
    collectionName: 'testresults',
    indexName: 'test_results_personality_type',
    keys: { personalityType: 1, completedAt: -1 },
    options: { background: true },
  },
  {
    collectionName: 'testresults',
    indexName: 'test_results_completed_at',
    keys: { completedAt: -1 },
    options: { background: true },
  },
  {
    collectionName: 'testresults',
    indexName: 'test_results_scores',
    keys: { 
      'scores.E': -1,
      'scores.I': -1,
      'scores.S': -1,
      'scores.N': -1,
      'scores.T': -1,
      'scores.F': -1,
      'scores.J': -1,
      'scores.P': -1
    },
    options: { background: true },
  },

  // Sessions Collection (if using custom sessions)
  {
    collectionName: 'sessions',
    indexName: 'sessions_expires_ttl',
    keys: { expiresAt: 1 },
    options: { 
      background: true,
      expireAfterSeconds: 0 // TTL index
    },
  },
  {
    collectionName: 'sessions',
    indexName: 'sessions_user_id',
    keys: { userId: 1, expiresAt: -1 },
    options: { background: true },
  },

  // Analytics/Stats Collection
  {
    collectionName: 'analytics',
    indexName: 'analytics_date_type',
    keys: { date: -1, type: 1 },
    options: { background: true },
  },
  {
    collectionName: 'analytics',
    indexName: 'analytics_resource_date',
    keys: { resourceType: 1, resourceId: 1, date: -1 },
    options: { background: true },
  },
  {
    collectionName: 'analytics',
    indexName: 'analytics_ttl',
    keys: { createdAt: 1 },
    options: { 
      background: true,
      expireAfterSeconds: 60 * 60 * 24 * 365 // 1 year
    },
  },
];

class DatabaseIndexManager {
  private static instance: DatabaseIndexManager;

  private constructor() {}

  static getInstance(): DatabaseIndexManager {
    if (!DatabaseIndexManager.instance) {
      DatabaseIndexManager.instance = new DatabaseIndexManager();
    }
    return DatabaseIndexManager.instance;
  }

  async createAllIndexes(): Promise<void> {
    await logger.info('Starting index creation process', 'DatabaseIndexManager');
    
    try {
      await dbConnect();
      const mongoose = await import('mongoose');
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database connection not established');
      }

      const results = await Promise.allSettled(
        INDEX_DEFINITIONS.map(indexDef => this.createIndex(db, indexDef))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      await logger.info(
        `Index creation completed: ${successful} successful, ${failed} failed`,
        'DatabaseIndexManager',
        { successful, failed, total: INDEX_DEFINITIONS.length }
      );

      // Log failed indexes
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const indexDef = INDEX_DEFINITIONS[index];
          logger.error(
            `Failed to create index ${indexDef.indexName}`,
            result.reason,
            'DatabaseIndexManager',
            { indexDefinition: indexDef }
          );
        }
      });

    } catch (error) {
      await logger.error('Failed to create indexes', error as Error, 'DatabaseIndexManager');
      throw error;
    }
  }

  private async createIndex(db: Db, indexDef: IndexDefinition): Promise<void> {
    try {
      const collection = db.collection(indexDef.collectionName);
      
      // Check if index already exists
      const existingIndexes = await collection.listIndexes().toArray();
      const indexExists = existingIndexes.some((idx: Document) => idx.name === indexDef.indexName);
      
      if (indexExists) {
        await logger.debug(
          `Index ${indexDef.indexName} already exists`,
          'DatabaseIndexManager'
        );
        return;
      }

      // Create the index
      const indexOptions: Record<string, unknown> = {
        name: indexDef.indexName,
        ...indexDef.options,
      };
      await collection.createIndex(indexDef.keys, indexOptions);

      await logger.info(
        `Created index ${indexDef.indexName} on ${indexDef.collectionName}`,
        'DatabaseIndexManager'
      );

    } catch (error) {
      await logger.error(
        `Failed to create index ${indexDef.indexName}`,
        error as Error,
        'DatabaseIndexManager'
      );
      throw error;
    }
  }

  async analyzeIndexUsage(): Promise<void> {
    await logger.info('Starting index usage analysis', 'DatabaseIndexManager');
    
    try {
      await dbConnect();
      const mongoose = await import('mongoose');
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = ['users', 'careers', 'testresults'];
      
      for (const collectionName of collections) {
        await this.analyzeCollectionIndexes(db, collectionName);
      }

    } catch (error) {
      await logger.error('Failed to analyze index usage', error as Error, 'DatabaseIndexManager');
    }
  }

  private async analyzeCollectionIndexes(db: Db, collectionName: string): Promise<void> {
    try {
      const collection = db.collection(collectionName);
      
      // Get index stats
      const indexStats = await collection.aggregate([
        { $indexStats: {} }
      ]).toArray();

      await logger.info(
        `Index usage for ${collectionName}`,
        'DatabaseIndexManager',
        { indexStats }
      );

      // Find unused indexes (excluding _id_ index)
      const unusedIndexes = indexStats.filter((stat: Document) => {
        const indexStat = stat as IndexStat;
        return indexStat.accesses?.ops === 0 && indexStat.name !== '_id_';
      });
      if (unusedIndexes.length > 0) {
        await logger.warn(
          `Found ${unusedIndexes.length} unused indexes in ${collectionName}`,
          'DatabaseIndexManager',
          { unusedIndexes: unusedIndexes.map((idx: Document) => (idx as IndexStat).name) }
        );
      }

    } catch (error) {
      await logger.error(
        `Failed to analyze indexes for ${collectionName}`,
        error as Error,
        'DatabaseIndexManager'
      );
    }
  }

  async optimizeQueries(): Promise<void> {
    await logger.info('Starting query optimization analysis', 'DatabaseIndexManager');
    
    try {
      await dbConnect();
      const mongoose = await import('mongoose');
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database connection not established');
      }

      // Enable profiling for slow queries
      await db.command({ profile: 2, slowms: 100 });
      
      await logger.info('Query profiling enabled for queries > 100ms', 'DatabaseIndexManager');

      // Get profiling data after some time
      setTimeout(async () => {
        try {
          const profilingData = await db.collection('system.profile')
            .find({ ts: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
            .sort({ ts: -1 })
            .limit(100)
            .toArray();

          await logger.info(
            `Found ${profilingData.length} slow queries in the last 24 hours`,
            'DatabaseIndexManager',
            { 
              slowQueries: profilingData.map((prof: Document) => ({
                command: prof.command,
                duration: prof.millis,
                collection: prof.ns,
                planSummary: prof.planSummary
              }))
            }
          );

        } catch (error) {
          await logger.error('Failed to analyze slow queries', error as Error, 'DatabaseIndexManager');
        }
      }, 60000); // Check after 1 minute

    } catch (error) {
      await logger.error('Failed to start query optimization', error as Error, 'DatabaseIndexManager');
    }
  }

  async dropUnusedIndexes(): Promise<void> {
    await logger.warn('Starting unused index cleanup', 'DatabaseIndexManager');
    
    try {
      await dbConnect();
      const mongoose = await import('mongoose');
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = ['users', 'careers', 'testresults'];
      
      for (const collectionName of collections) {
        await this.dropCollectionUnusedIndexes(db, collectionName);
      }

    } catch (error) {
      await logger.error('Failed to drop unused indexes', error as Error, 'DatabaseIndexManager');
    }
  }

  private async dropCollectionUnusedIndexes(db: Db, collectionName: string): Promise<void> {
    try {
      const collection = db.collection(collectionName);
      
      // Get index stats
      const indexStats = await collection.aggregate([
        { $indexStats: {} }
      ]).toArray();

      // Find unused indexes (excluding _id_ index)
      const unusedIndexes = indexStats.filter((stat: Document) => {
        const indexStat = stat as IndexStat;
        return indexStat.accesses?.ops === 0 && indexStat.name !== '_id_';
      });

      for (const unusedIndex of unusedIndexes) {
        try {
          await collection.dropIndex((unusedIndex as IndexStat).name);
          await logger.info(
            `Dropped unused index: ${(unusedIndex as IndexStat).name} from ${collectionName}`,
            'DatabaseIndexManager'
          );
        } catch (error) {
          await logger.error(
            `Failed to drop index ${(unusedIndex as IndexStat).name}`,
            error as Error,
            'DatabaseIndexManager'
          );
        }
      }

    } catch (error) {
      await logger.error(
        `Failed to analyze indexes for ${collectionName}`,
        error as Error,
        'DatabaseIndexManager'
      );
    }
  }

  async getIndexHealth(): Promise<{
    collections: Array<{
      name: string;
      indexCount: number;
      totalSize: number;
      usage: Array<{
        name: string;
        uses: number;
        since: Date;
      }>;
    }>;
  }> {
    try {
      await dbConnect();
      const mongoose = await import('mongoose');
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = ['users', 'careers', 'testresults'];
      const resultCollections = [];

      for (const collectionName of collections) {
        try {
          const collection = db.collection(collectionName);
          
          // Get collection stats
          const stats = await db.command({ collStats: collectionName });
          
          // Get index usage
          const indexStats = await collection.aggregate([
            { $indexStats: {} }
          ]).toArray();

          resultCollections.push({
            name: collectionName,
            indexCount: stats.nindexes || 0,
            totalSize: stats.totalIndexSize || 0,
            usage: indexStats.map((idx: Document) => {
              const indexStat = idx as IndexStat;
              return {
                name: indexStat.name,
                uses: indexStat.accesses?.ops || 0,
                since: indexStat.accesses?.since || new Date()
              };
            })
          });

        } catch (error) {
          await logger.error(
            `Failed to get health for ${collectionName}`,
            error as Error,
            'DatabaseIndexManager'
          );
        }
      }

      return { collections: resultCollections };

    } catch (error) {
      await logger.error('Failed to get index health', error as Error, 'DatabaseIndexManager');
      throw error;
    }
  }
}

// Export singleton instance and utility functions
export const databaseIndexManager = DatabaseIndexManager.getInstance();

export async function initializeIndexes(): Promise<void> {
  if (process.env.NODE_ENV === 'production' || process.env.CREATE_INDEXES === 'true') {
    await databaseIndexManager.createAllIndexes();
  }
}

export async function analyzeDatabase(): Promise<void> {
  await databaseIndexManager.analyzeIndexUsage();
  await databaseIndexManager.optimizeQueries();
}

export { DatabaseIndexManager, INDEX_DEFINITIONS }; 
