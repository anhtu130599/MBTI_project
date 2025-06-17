// Error monitoring and logging utilities

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS = {
  ERROR: 'error' as const,
  WARN: 'warn' as const,
  INFO: 'info' as const,
  DEBUG: 'debug' as const,
} as const;

interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: string;
  context?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
  metadata?: Record<string, any>;
}

interface ErrorEvent {
  error: Error;
  context?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
  context?: string;
}

class Logger {
  private static instance: Logger;
  private environment: string;
  private serviceName: string;
  private serviceVersion: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.serviceName = process.env.SERVICE_NAME || 'mbti-app';
    this.serviceVersion = process.env.SERVICE_VERSION || '1.0.0';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    context?: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata: {
        environment: this.environment,
        service: this.serviceName,
        version: this.serviceVersion,
        ...metadata,
      },
    };
  }

  private shouldLog(level: 'error' | 'warn' | 'info' | 'debug'): boolean {
    const logLevelHierarchy = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = logLevelHierarchy.indexOf(
      (process.env.LOG_LEVEL || 'info').toLowerCase()
    );
    const requestedLevelIndex = logLevelHierarchy.indexOf(level.toLowerCase());
    
    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatForConsole(entry: LogEntry): void {
    const { timestamp, level, message, context, metadata } = entry;
    const contextStr = context ? `[${context}]` : '';
    const baseMessage = `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;

    switch (level) {
      case 'error':
        console.error(baseMessage, metadata?.error || metadata);
        break;
      case 'warn':
        console.warn(baseMessage, metadata);
        break;
      case 'info':
        console.info(baseMessage, metadata);
        break;
      case 'debug':
        console.debug(baseMessage, metadata);
        break;
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // In production, send to external logging service
    // Examples: Winston with external transports, Datadog, CloudWatch, etc.
    
    if (this.environment === 'production') {
      try {
        // Example: Send to external logging service
        // await fetch('https://logging-service.com/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry),
        // });
        
        // For now, just console log in production too
        this.formatForConsole(entry);
      } catch (error) {
        // Fallback to console if external service fails
        console.error('Failed to send log to external service:', error);
        this.formatForConsole(entry);
      }
    } else {
      this.formatForConsole(entry);
    }
  }

  async log(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    context?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.shouldLog(level as 'error' | 'warn' | 'info' | 'debug')) return;

    const entry = this.createLogEntry(level as 'error' | 'warn' | 'info' | 'debug', message, context, metadata);
    await this.sendToExternalService(entry);
  }

  async error(
    message: string,
    error?: Error,
    context?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const errorMetadata = error ? {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any).code && { code: (error as any).code },
      },
      ...metadata,
    } : metadata;

    await this.log('error', message, context, errorMetadata);
  }

  async warn(message: string, context?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log('warn', message, context, metadata);
  }

  async info(message: string, context?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log('info', message, context, metadata);
  }

  async debug(message: string, context?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log('debug', message, context, metadata);
  }
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  async captureError(event: ErrorEvent): Promise<void> {
    const { error, context, userId, sessionId, requestId, tags, extra } = event;

    // Log the error
    await this.logger.error(
      `Uncaught error: ${error.message}`,
      error,
      context,
      {
        userId,
        sessionId,
        requestId,
        tags,
        extra,
      }
    );

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Sentry integration
        // Sentry.captureException(error, {
        //   user: { id: userId },
        //   tags,
        //   extra: { context, sessionId, requestId, ...extra },
        // });

        // Example: Custom error tracking service
        // await fetch('https://error-tracking.com/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     error: {
        //       name: error.name,
        //       message: error.message,
        //       stack: error.stack,
        //     },
        //     context,
        //     userId,
        //     sessionId,
        //     requestId,
        //     tags,
        //     extra,
        //     timestamp: new Date().toISOString(),
        //   }),
        // });
        
        console.error('Error would be sent to monitoring service in production');
      } catch (monitoringError) {
        await this.logger.error(
          'Failed to send error to monitoring service',
          monitoringError as Error,
          'ErrorMonitor'
        );
      }
    }
  }

  async captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    switch (level) {
      case 'error':
        await this.logger.error(message, undefined, context, metadata);
        break;
      case 'warning':
        await this.logger.warn(message, context, metadata);
        break;
      default:
        await this.logger.info(message, context, metadata);
    }

    // Send to monitoring service if needed
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      // Send critical messages to monitoring service
    }
  }
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private logger: Logger;
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  private constructor() {
    this.logger = Logger.getInstance();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        value: duration,
        timestamp: new Date().toISOString(),
      });
    };
  }

  recordMetric(metric: PerformanceMetric): void {
    // Store metric
    const existing = this.metrics.get(metric.name) || [];
    existing.push(metric);
    
    // Keep only last 100 metrics per name
    if (existing.length > 100) {
      existing.shift();
    }
    
    this.metrics.set(metric.name, existing);

    // Log slow operations
    if (metric.value > 1000) { // > 1 second
      this.logger.warn(
        `Slow operation detected: ${metric.name}`,
        'PerformanceMonitor',
        { metric }
      );
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to metrics service
      // this.sendMetricToService(metric);
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || [];
    }
    
    const allMetrics: PerformanceMetric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }
    
    return allMetrics;
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }
}

// Utility functions for API routes
export function withRequestLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  routeName: string
) {
  return async (...args: T): Promise<R> => {
    const logger = Logger.getInstance();
    const performanceMonitor = PerformanceMonitor.getInstance();
    
    const endTimer = performanceMonitor.startTimer(`api.${routeName}`);
    const startTime = Date.now();
    
    try {
      await logger.info(`API request started: ${routeName}`, 'API');
      
      const result = await handler(...args);
      
      const responseTime = Date.now() - startTime;
      await logger.info(
        `API request completed: ${routeName}`,
        'API',
        { responseTime, status: 'success' }
      );
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMonitor = ErrorMonitor.getInstance();
      
      await errorMonitor.captureError({
        error: error as Error,
        context: `API.${routeName}`,
        extra: { responseTime },
      });
      
      throw error;
    } finally {
      endTimer();
    }
  };
}

export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    const errorMonitor = ErrorMonitor.getInstance();
    await errorMonitor.captureError({
      error: reason instanceof Error ? reason : new Error(String(reason)),
      context: 'UnhandledPromiseRejection',
      extra: { promise: promise.toString() },
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    const errorMonitor = ErrorMonitor.getInstance();
    await errorMonitor.captureError({
      error,
      context: 'UncaughtException',
    });
    
    // Exit gracefully
    process.exit(1);
  });

  // Handle SIGTERM for graceful shutdown
  process.on('SIGTERM', async () => {
    const logger = Logger.getInstance();
    await logger.info('SIGTERM received, shutting down gracefully', 'System');
    process.exit(0);
  });
}

// Export singleton instances
export const logger = Logger.getInstance();
export const errorMonitor = ErrorMonitor.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();

// Export classes for testing
export { Logger, ErrorMonitor, PerformanceMonitor }; 
