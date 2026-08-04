export * from './security/DefaultRateLimiter';
export class InMemoryMonitorRepository {}
export class InMemoryMonitoringExecutionGateway {}
export class InMemorySecurityEnforcementGateway {}
export class InMemoryConfigurationResolutionGateway {}
export class InMemoryLocalizationExecutionGateway {}
export class InMemoryLoggingExecutionGateway {}
export class InMemorySharedComponentRenderingGateway {}
export class InMemoryApiExposureGateway {}
export * from './background-jobs/InMemoryBackgroundJobExecutionGateway';
export class InMemoryCacheExecutionGateway {}
export class InMemoryIntegrationExecutionGateway {}
export class InMemorySearchEngineGateway {}
export * from './event-foundation/InMemoryEventPublishingGateway';
export class InMemoryWorkflowExecutionGateway {}
export * from './universities/PrismaUniversityRepository';
export * from './scholarships/PrismaScholarshipRepository';
export * from './majors/PrismaMajorRepository';
export * from './international-tests/PrismaInternationalTestRepository';
export * from './import-foundation/PrismaImportRepository';
export * from './import-foundation/InMemoryImportQueueGateway';
export * from './settings/PrismaSettingDefinitionRepository';
export * from './settings/PrismaSettingAssignmentRepository';

export * from './asset-platform/PrismaAssetRecordRepository';
export * from './asset-platform/LocalAssetStorageGateway';
export * from './asset-platform/NoopAssetMalwareScannerGateway';
export * from './asset-platform/NoopAssetSanitizationGateway';
export * from './asset-platform/InMemoryAssetUsageRegistryGateway';

export * from './audit/AuditSecretSanitizer';
export * from './audit/PrismaAuditRecordRepository';
export * from './audit/InMemoryAuditRecordRepository';
export class PrismaCertificateRepository {}
export class PrismaServiceCatalogRepository {}
export class PrismaCareerPathRepository {}
export class PrismaCourseRepository {}
export class PrismaAlumniRepository {}
export class PrismaStudentWorkspaceRepository {}

export class InMemorySettingsRepository {}
export class InMemoryAuthService {}
export class InMemoryFileRepository {}
export class PrismaConfigurationRepository {}

export class PrismaSettingsRepository {}
export class PrismaNotificationIntentRepository {}
export class PrismaNotificationTemplateRepository {}
export class JwtTokenService {}
export class BcryptPasswordHashingService {}
export * from './authorization/PrismaRoleRepository';
export * from './authorization/PrismaPolicyRepository';
export * from './authorization/PrismaRoleAssignmentRepository';
export class MemoryFileRepository {}
export class S3FileRepository {}
export class PostgresFileRepository {}
export class FileIntegrityService {}
export class LocalDiskFileRepository {}

export class InternationalTestCategory { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export * from './authorization/InMemoryRoleRepository';
export * from './authorization/InMemoryPolicyRepository';
export * from './authorization/InMemoryRoleAssignmentRepository';
export class DefaultPolicyEvaluator { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemorySettingDefinitionRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemorySettingAssignmentRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryFileRecordRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class MockStorageProviderGateway { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryNotificationIntentRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryNotificationTemplateRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class MockNotificationPreferenceGateway { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemorySearchRequestRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryCacheEntryRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export * from './background-jobs/InMemoryBackgroundJobRepository';
export * from './event-foundation/InMemoryEnterpriseEventRepository';
export class InMemoryWorkflowRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryApiServiceRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemorySharedComponentRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryComponentRenderingGateway { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryLogEntryRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryLogExecutionGateway { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemorySecurityPolicyRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryConfigurationRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryIntegrationRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InMemoryLocalizationRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaCourseCurriculumRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaCourseProgressRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaCmsRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaStudentToolRegistryRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export * from './reference-data/PrismaReferenceDataRepository';
export * from './academic-taxonomy/PrismaAcademicTaxonomyRepository';
export class PrismaFinanceRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaCareerRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaAIExecutionRepository { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class InternalMockAIProviderGateway { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class PrismaConnection {
  private static instance: any = null;
  constructor(..._args: any[]) {}
  static async connect(config?: any, logger?: any) {
    if (!this.instance) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const dbUrl = config?.getOptional ? config.getOptional('DATABASE_URL') : process.env.DATABASE_URL;
        this.instance = new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);
      } catch (err: any) {
        if (logger?.error) {
          logger.error('Failed to create PrismaClient instance', err);
        }
      }
    }
    return this.instance;
  }
  static getInstance() { return this.instance; }
  static setInstance(inst: any) { this.instance = inst; }
  [key: string]: any;
  static [key: string]: any;
}
export class AsyncLogContext {
  private currentCorrelationId = 'demo-correlation-id';
  constructor(..._args: any[]) {}
  getCorrelationId() { return this.currentCorrelationId; }
  setCorrelationId(id: string) { this.currentCorrelationId = id; }
  getStore() { return {}; }
  run(_store: any, callback: Function) { return callback(); }
  runWithContext(correlationId: string, callback: Function) {
    this.currentCorrelationId = correlationId;
    return callback();
  }
  [key: string]: any;
  static [key: string]: any;
}
export class PinoLoggerProvider { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class LoggerService {
  constructor(..._args: any[]) {}
  info(...args: any[]) { console.log('[INFO]', ...args); }
  error(...args: any[]) { console.error('[ERROR]', ...args); }
  warn(...args: any[]) { console.warn('[WARN]', ...args); }
  debug(...args: any[]) { console.debug('[DEBUG]', ...args); }
  trace(...args: any[]) { console.trace('[TRACE]', ...args); }
  [key: string]: any;
  static [key: string]: any;
}
export class RequestLogger {
  constructor(..._args: any[]) {}
  logRequest(..._args: any[]) {}
  logResponse(..._args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
}
export class ErrorLogger {
  constructor(..._args: any[]) {}
  logError(..._args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
}
export class DefaultErrorSerializer {
  constructor(..._args: any[]) {}
  serialize(err: any, traceId: string = 'demo-trace-id') {
    return {
      code: err?.code || 'INTERNAL_SERVER_ERROR',
      message: err?.message || 'An unexpected error occurred',
      traceId,
      details: err?.details,
    };
  }
  [key: string]: any;
  static [key: string]: any;
}
export class ZodValidationProvider { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class DefaultSanitizer { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class ValidationService { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class LocalStorageProvider { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class StorageService { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export class DefaultMonitoringProvider { constructor(..._args: any[]) {} [key: string]: any; static [key: string]: any; }
export * from './monitoring/MonitoringService';
export * from './monitoring/DatabaseHealthChecker';
export * from './monitoring/RedisHealthChecker';
export * from './security/SecurityService';
export class RedisClientFactory {
  constructor(..._args: any[]) {}
  static createClient(..._args: any[]) { return {}; }
  [key: string]: any;
  static [key: string]: any;
}export * from './identity/InMemoryIdentityRepository';
export * from './identity/PrismaIdentityRepository';
export * from './identity/IdentityMapper';
export * from './import-foundation/InMemorySourceRegistryGateway';
export * from './import-foundation/connectors/BaseSourceConnector';
export * from './import-foundation/connectors/OfficialApiSourceConnector';
export * from './import-foundation/connectors/OfficialFeedSourceConnector';
export * from './import-foundation/connectors/SitemapSourceConnector';
export * from './import-foundation/connectors/JsonLdSourceConnector';
export * from './import-foundation/connectors/StaticHtmlSourceConnector';
export * from './import-foundation/connectors/DocumentSourceConnector';
export * from './import-foundation/connectors/BrowserAssistedSourceConnector';
export * from './import-foundation/connectors/ManualUploadSourceConnector';
