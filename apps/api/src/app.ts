import * as awilix from 'awilix';
import express, { Router, Express, Request, Response } from 'express';
import * as path from 'path';
import { container, registerDependencies } from './infrastructure/di/container.js';
import { 
  PrismaConnection,
  AsyncLogContext,
  PinoLoggerProvider,
  LoggerService,
  RequestLogger,
  ErrorLogger,
  DefaultErrorSerializer,
  ZodValidationProvider,
  DefaultSanitizer,
  ValidationService,
  LocalStorageProvider,
  StorageService,
  DefaultMonitoringProvider,
  MonitoringService,
  DefaultRateLimiter,
  SecurityService,
  DatabaseHealthChecker,
  RedisClientFactory,
  RedisHealthChecker
} from '@manaratak/infrastructure';
import { ConfigurationRegistry, EnvironmentLoader, EnvironmentConfigurationProvider, ProductionReadinessValidator, ZodEnvironmentValidator } from '@manaratak/config';
import { IConfigurationService, ILogger, IValidationService, ISecurityService, IMonitoringService, IRateLimiter, HealthStatus } from '@manaratak/core';

class AppLogger extends LoggerService implements ILogger {
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.error) this.error(message, error, context);
  }
}

class AppValidationService extends ValidationService implements IValidationService {
  async execute<T>(context: any, schema: any): Promise<any> {
    return (this as any).validate ? (this as any).validate(context, schema) : { isSuccess: true, getValue: () => ({}) };
  }
}

class AppSecurityService extends SecurityService implements ISecurityService {}

class AppMonitoringService extends MonitoringService implements IMonitoringService {}
import { LoggingMiddleware } from './presentation/middleware/LoggingMiddleware.js';
import { GlobalExceptionHandler } from './presentation/middleware/GlobalExceptionHandler.js';
import { DtoValidationMiddleware } from './presentation/validation/DtoValidationMiddleware.js';
import { ApiRouter } from './presentation/api/router/ApiRouter.js';
import { ResponseFormatter } from './presentation/api/response/ResponseFormatter.js';
import { MonitoringRouter } from './presentation/api/router/MonitoringRouter.js';
import { MonitoringMiddleware } from './presentation/monitoring/MonitoringMiddleware.js';
import { SecurityMiddlewareFactory } from './presentation/security/SecurityMiddlewareFactory.js';
import { SecurityValidator } from './presentation/security/SecurityValidator.js';

export interface CreateApiAppOptions {
  securityService?: ISecurityService;
  rateLimiter?: IRateLimiter;
  monitoringService?: IMonitoringService;
  env?: Record<string, string | undefined>;
  resetCache?: boolean;
}

let appInstance: Express | null = null;
let isBootstrapping = false;
let bootstrapPromise: Promise<Express> | null = null;

export async function createApiApp(options?: CreateApiAppOptions): Promise<Express> {
  if (options?.resetCache || options?.env) {
    appInstance = null;
    bootstrapPromise = null;
    ConfigurationRegistry._reset();
  }

  if (appInstance) {
    return appInstance;
  }

  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    try {
      const currentEnv = options?.env || process.env;

      // Bootstrap Configuration First
      let config: IConfigurationService;
      try {
        config = ConfigurationRegistry.getInstance();
      } catch {
        const envProvider = new EnvironmentConfigurationProvider(currentEnv);
        const loader = new EnvironmentLoader([envProvider]);
        config = await ConfigurationRegistry.bootstrap(loader, new ZodEnvironmentValidator());
      }
      const productionReadinessReport = ProductionReadinessValidator.validate(currentEnv);

      const nodeEnv = config.getOptional<string>('NODE_ENV') || currentEnv.NODE_ENV;
      const isProductionOrStaging = nodeEnv === 'production' || nodeEnv === 'staging';

      if (isProductionOrStaging && (!productionReadinessReport.ready || productionReadinessReport.blockerCount > 0)) {
        const blockerDetails = productionReadinessReport.findings
          .filter(f => f.severity === 'BLOCKER')
          .map(f => `[${f.id}] ${f.area}: ${f.message}`)
          .join('; ');

        throw new Error(
          `Production readiness validation failed for environment '${nodeEnv}'. ` +
          `Found ${productionReadinessReport.blockerCount} blocker(s): ${blockerDetails}`
        );
      }

      // Bootstrap Logging
      const logContext = new AsyncLogContext();
      const loggerProvider = new PinoLoggerProvider();
      const logger = new AppLogger(loggerProvider, logContext, config);

      const requestLogger = new RequestLogger(logger, logContext);
      const errorLogger = new ErrorLogger(logger);

      // Bootstrap Error Handling
      const errorSerializer = new DefaultErrorSerializer();
      const exceptionHandler = new GlobalExceptionHandler(logger, logContext, errorSerializer);

      // Bootstrap Validation
      const validationProvider = new ZodValidationProvider();
      const inputSanitizer = new DefaultSanitizer();
      const validationService = new AppValidationService(validationProvider, inputSanitizer);
      const dtoValidationMiddleware = new DtoValidationMiddleware(validationService);

      // Bootstrap Storage
      const storageBasePath = config.getOptional<string>('STORAGE_BASE_PATH') || path.join(process.cwd(), 'uploads');
      const storageProvider = new LocalStorageProvider(storageBasePath);
      const storageService = new StorageService(storageProvider);

      // Bootstrap Monitoring
      const monitoringProvider = new DefaultMonitoringProvider();
      const monitoringService = options?.monitoringService || new AppMonitoringService(monitoringProvider as any);

      // Bootstrap Security
      const rateLimiter = options?.rateLimiter || new DefaultRateLimiter();
      const securityService = options?.securityService || new AppSecurityService(rateLimiter);

      // Assert Production Security Guardrails
      SecurityValidator.assertProductionSecurity(currentEnv, securityService, rateLimiter);

    // Bootstrap API
    const apiRouter = new ApiRouter();
    const app = express();

    // Security Configuration
    const cspEnabled = config.getOptional<string>('SECURITY_CSP_ENABLED') === 'true';
    const corsOrigins = config.getOptional<string>('CORS_ORIGIN') 
      ? [config.getOptional<string>('CORS_ORIGIN')!] 
      : config.getOptional<string>('SECURITY_CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
    const rateLimitMax = parseInt(config.getOptional<string>('SECURITY_RATE_LIMIT_MAX') || '100', 10);
    const rateLimitWindow = parseInt(config.getOptional<string>('SECURITY_RATE_LIMIT_WINDOW_MS') || '60000', 10);
    const adminAuthMode = SecurityMiddlewareFactory.resolveAdminAuthMode({
      NODE_ENV: config.getOptional<string>('NODE_ENV') || process.env.NODE_ENV,
      ADMIN_AUTH_MODE: config.getOptional<string>('ADMIN_AUTH_MODE') || process.env.ADMIN_AUTH_MODE,
    });
    const adminBearerToken = config.getOptional<string>('ADMIN_BEARER_TOKEN');

    // Security Middleware
    app.use(SecurityMiddlewareFactory.createSecurityHeaders({ enabled: cspEnabled }));
    app.use(SecurityMiddlewareFactory.createCors({ allowedOrigins: corsOrigins }));
    app.use(SecurityMiddlewareFactory.createRateLimiter(securityService, { limit: rateLimitMax, windowMs: rateLimitWindow }));
    app.use(express.json());
    app.use(SecurityMiddlewareFactory.createCsrfGuard(securityService));

    // Logging Middleware
    const loggingMiddleware = new LoggingMiddleware(logContext, requestLogger);
    app.use(loggingMiddleware.generate());

    // Monitoring Middleware
    const monitoringMiddleware = new MonitoringMiddleware(monitoringService);
    app.use(monitoringMiddleware.generate());

    // Register DI Dependencies
    registerDependencies();
    container.register({ 
      monitoringService: awilix.asValue(monitoringService),
      securityService: awilix.asValue(securityService)
    });

    // Establish Database Connection if available
    const databaseUrl = config.getOptional<string>('DATABASE_URL') || currentEnv.DATABASE_URL;
    if (databaseUrl) {
      try {
        await PrismaConnection.connect(config, logger);
        const dbHealthChecker = new DatabaseHealthChecker(PrismaConnection.getInstance());
        monitoringService.registerIndicator({
          name: 'database',
          isOptional: false,
          checkHealth: async () => {
            return await dbHealthChecker.checkHealth();
          }
        });
      } catch (error: any) {
        logger.error("[Database] Could not connect to Prisma instance", error);
        monitoringService.registerIndicator({
          name: 'database',
          isOptional: false,
          checkHealth: async () => ({
            status: HealthStatus.DOWN,
            timestamp: new Date().toISOString(),
            error: error?.message || 'Database connection failed'
          })
        });
      }
    } else {
      monitoringService.registerIndicator({
        name: 'database',
        isOptional: false,
        checkHealth: async () => ({
          status: HealthStatus.DOWN,
          timestamp: new Date().toISOString(),
          error: 'DATABASE_URL is not configured'
        })
      });
    }

    // Register Redis Health Indicator if available
    const redisUrl = config.getOptional<string>('REDIS_URL') || currentEnv.REDIS_URL;
    if (redisUrl) {
      try {
        const redisClient = RedisClientFactory.createClient(config, logger);
        const redisHealthChecker = new RedisHealthChecker(redisClient);
        
        monitoringService.registerIndicator({
          name: 'redis',
          isOptional: true,
          checkHealth: async () => {
            return await redisHealthChecker.checkHealth();
          }
        });
      } catch (error: any) {
        logger.error("[Redis] Failed to initialize Redis client", error);
        monitoringService.registerIndicator({
          name: 'redis',
          isOptional: true,
          checkHealth: async () => ({
            status: HealthStatus.DEGRADED,
            timestamp: new Date().toISOString(),
            error: error?.message || 'Redis client initialization failed'
          })
        });
      }
    }

    // Define API v1 Router
    const v1Router = Router();

    // CSRF Token endpoint for clients
    v1Router.get('/csrf-token', (req: Request, res: Response) => {
      const sessionSecret = (req.headers['x-session-secret'] as string) 
        || (req as any).session?.secret 
        || config.getOptional<string>('SESSION_SECRET') 
        || process.env.SESSION_SECRET 
        || '';
      const token = securityService.generateCsrfToken(sessionSecret);
      res.setHeader('X-CSRF-Token', token);
      res.status(200).json(new ResponseFormatter('v1').success({
        csrfToken: token
      }));
    });

    // Register versioned routes
    v1Router.use('/identities', container.resolve('identityRouter'));
    v1Router.use('/auth', container.resolve('authRouter'));
    v1Router.use('/admin', SecurityMiddlewareFactory.createAdminGuard({
      mode: adminAuthMode,
      bearerToken: adminBearerToken,
    }));
    const requireAdminPermission = SecurityMiddlewareFactory.createAdminPermissionGuard;
    v1Router.use('/admin/authorization', requireAdminPermission('admin:authorization:manage'), container.resolve('authorizationAdminRouter'));
    v1Router.use('/authorization', container.resolve('authorizationRuntimeRouter'));
    v1Router.use('/admin/settings', requireAdminPermission('admin:settings:manage'), container.resolve('settingsAdminRouter'));
    v1Router.use('/admin/scholarships', requireAdminPermission('admin:scholarships:manage'), container.resolve('scholarshipAdminRouter'));
    v1Router.use('/admin/imports', requireAdminPermission('admin:imports:manage'), container.resolve('importAdminRouter'));
    v1Router.use('/admin/universities', requireAdminPermission('admin:universities:manage'), container.resolve('universityAdminRouter'));
    v1Router.use('/admin/majors', requireAdminPermission('admin:majors:manage'), container.resolve('majorAdminRouter'));
    v1Router.use('/admin/courses', requireAdminPermission('admin:courses:manage'), container.resolve('courseAdminRouter'));
    v1Router.use('/admin/certificates', requireAdminPermission('admin:certificates:manage'), container.resolve('certificateAdminRouter'));
    v1Router.use('/admin/cms', requireAdminPermission('admin:cms:manage'), container.resolve('cmsAdminRouter'));
    v1Router.use('/admin/student-tools', requireAdminPermission('admin:student-tools:manage'), container.resolve('studentToolsAdminRouter'));
    v1Router.use('/admin/reference-data', requireAdminPermission('admin:reference-data:manage'), container.resolve('referenceDataAdminRouter'));
    v1Router.use('/admin/academic-taxonomy', requireAdminPermission('admin:academic-taxonomy:manage'), container.resolve('academicTaxonomyAdminRouter'));
    v1Router.use('/admin/services', requireAdminPermission('admin:services:manage'), container.resolve('serviceAdminRouter'));
    v1Router.use('/admin/finance', requireAdminPermission('admin:finance:manage'), container.resolve('financeAdminRouter'));
    v1Router.use('/admin/careers', requireAdminPermission('admin:careers:manage'), container.resolve('careerAdminRouter'));
    v1Router.use('/admin/international-tests', requireAdminPermission('admin:international-tests:manage'), container.resolve('internationalTestAdminRouter'));
    v1Router.use('/admin/assets', requireAdminPermission('admin:assets:manage'), container.resolve('assetPlatformRouter'));
    v1Router.use('/ai', container.resolve('aiGatewayRouter'));
    v1Router.use('/public/scholarships', container.resolve('scholarshipPublicRouter'));
    v1Router.use('/public/universities', container.resolve('universityPublicRouter'));
    v1Router.use('/public/majors', container.resolve('majorPublicRouter'));
    v1Router.use('/public/courses', container.resolve('coursePublicRouter'));
    v1Router.use('/public/certificates', container.resolve('certificatePublicRouter'));
    v1Router.use('/public/cms', container.resolve('cmsPublicRouter'));
    v1Router.use('/public/student-tools', container.resolve('studentToolsPublicRouter'));
    v1Router.use('/public/services', container.resolve('servicePublicRouter'));
    v1Router.use('/public/careers', container.resolve('careerPublicRouter'));
    v1Router.use('/public/international-tests', container.resolve('internationalTestPublicRouter'));
    v1Router.use('/student', container.resolve('studentWorkspaceRouter'));
    v1Router.use('/reference-data', container.resolve('referenceDataPublicRouter'));
    v1Router.use('/academic-taxonomy', container.resolve('academicTaxonomyPublicRouter'));
    v1Router.use('/settings', container.resolve('settingsRuntimeRouter'));
    v1Router.use('/files', container.resolve('fileManagementRouter'));
    v1Router.use('/notifications', container.resolve('notificationRouter'));
    v1Router.use('/audit', container.resolve('auditRouter'));
    v1Router.use('/search', container.resolve('searchRouter'));
    v1Router.use('/cache', container.resolve('cacheRouter'));
    v1Router.use('/background-jobs', container.resolve('backgroundJobRouter'));
    v1Router.use('/workflows', container.resolve('workflowRouter'));
    v1Router.use('/api-services', container.resolve('apiFoundationRouter'));
    v1Router.use('/shared-components', container.resolve('sharedComponentRouter'));
    v1Router.use('/enterprise-events', container.resolve('enterpriseEventRouter'));
    v1Router.use('/monitoring', MonitoringRouter.create({ monitoringService, productionReadinessReport }));

    apiRouter.registerVersion('v1', v1Router);
    
    // Mount API Router on /api
    app.use('/api', apiRouter.getRouter());

    // Global Error Handler Middleware
    app.use(exceptionHandler.generate());

    appInstance = app;
    return app;
    } catch (err) {
      bootstrapPromise = null;
      throw err;
    }
  })();

  return bootstrapPromise;
}
