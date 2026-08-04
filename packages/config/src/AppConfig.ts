import { z } from 'zod';

const WEAK_SECRET_PATTERNS = [
  'dev-secret',
  'manaratak-local-development',
  'manaratak-session-secret',
  'manaratak-default-csrf-secret',
  'manaratak-admin-bearer-token',
  'change-me',
  'placeholder',
  '12345678',
  'default-secret',
  'short-secret',
];

function isWeakSecret(secret: string): boolean {
  const lower = secret.toLowerCase();
  return WEAK_SECRET_PATTERNS.some(pattern => lower.includes(pattern));
}

export const AppConfigSchema = z.preprocess((input) => {
  const env = (input && typeof input === 'object' ? input : {}) as Record<string, string | undefined>;
  const nodeEnv = env.NODE_ENV || 'development';
  const isProductionOrStaging = nodeEnv === 'production' || nodeEnv === 'staging';

  if (!isProductionOrStaging) {
    // In development and test environments, supply safe local defaults for missing values
    return {
      ...env,
      NODE_ENV: nodeEnv,
      DATABASE_URL: env.DATABASE_URL || 'file:./dev.db',
      REDIS_URL: env.REDIS_URL || 'redis://localhost:6379',
      JWT_SECRET: env.JWT_SECRET || 'dev-secret-at-least-32-characters-long-manaratak-key-phrase',
      SESSION_SECRET: env.SESSION_SECRET || 'dev-session-secret-at-least-32-chars-long',
      CSRF_SECRET: env.CSRF_SECRET || 'dev-csrf-secret-at-least-32-chars-long',
      ADMIN_AUTH_MODE: env.ADMIN_AUTH_MODE || 'demo',
    };
  }

  // In production and staging, DO NOT inject fallback defaults for critical runtime variables
  return {
    ...env,
    NODE_ENV: nodeEnv,
  };
}, z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  OTEL_SERVICE_NAME: z.string().min(1).default('manaratak-api'),
  API_BASE_URL: z.string().optional(),
  
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  CSRF_SECRET: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  ADMIN_AUTH_MODE: z.enum(['demo', 'strict']).optional(),
  ADMIN_BEARER_TOKEN: z.string().optional(),
}).passthrough().superRefine((data, ctx) => {
  const isProdOrStaging = data.NODE_ENV === 'production' || data.NODE_ENV === 'staging';

  if (isProdOrStaging) {
    // 1. DATABASE_URL
    if (!data.DATABASE_URL || data.DATABASE_URL.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required in production/staging',
        path: ['DATABASE_URL'],
      });
    } else {
      const dbUrl = data.DATABASE_URL.toLowerCase();
      if (dbUrl.startsWith('file:') || dbUrl.startsWith('sqlite:') || dbUrl.includes('dev.db')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Local SQLite DATABASE_URL is strictly forbidden in production/staging',
          path: ['DATABASE_URL'],
        });
      }
    }

    // 2. REDIS_URL (optional in prod/staging, but validate format if provided)
    if (data.REDIS_URL && data.REDIS_URL.trim() !== '') {
      if (!data.REDIS_URL.startsWith('redis://') && !data.REDIS_URL.startsWith('rediss://')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REDIS_URL must start with redis:// or rediss://',
          path: ['REDIS_URL'],
        });
      }
    }

    // 3. JWT_SECRET
    if (!data.JWT_SECRET || data.JWT_SECRET.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET is required in production/staging',
        path: ['JWT_SECRET'],
      });
    } else if (data.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET must be at least 32 characters long in production/staging',
        path: ['JWT_SECRET'],
      });
    } else if (isWeakSecret(data.JWT_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET uses a known insecure default or weak pattern in production/staging',
        path: ['JWT_SECRET'],
      });
    }

    // 4. SESSION_SECRET
    if (!data.SESSION_SECRET || data.SESSION_SECRET.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SESSION_SECRET is required in production/staging',
        path: ['SESSION_SECRET'],
      });
    } else if (data.SESSION_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SESSION_SECRET must be at least 32 characters long in production/staging',
        path: ['SESSION_SECRET'],
      });
    } else if (isWeakSecret(data.SESSION_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SESSION_SECRET uses a known insecure default or weak pattern in production/staging',
        path: ['SESSION_SECRET'],
      });
    }

    // 5. CSRF_SECRET
    if (!data.CSRF_SECRET || data.CSRF_SECRET.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CSRF_SECRET is required in production/staging',
        path: ['CSRF_SECRET'],
      });
    } else if (data.CSRF_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CSRF_SECRET must be at least 32 characters long in production/staging',
        path: ['CSRF_SECRET'],
      });
    } else if (isWeakSecret(data.CSRF_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CSRF_SECRET uses a known insecure default or weak pattern in production/staging',
        path: ['CSRF_SECRET'],
      });
    }

    // 6. CORS_ORIGIN
    if (!data.CORS_ORIGIN || data.CORS_ORIGIN.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CORS_ORIGIN is required in production/staging',
        path: ['CORS_ORIGIN'],
      });
    } else if (data.CORS_ORIGIN.trim() === '*') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CORS_ORIGIN cannot be wildcard "*" in production/staging',
        path: ['CORS_ORIGIN'],
      });
    }

    // 7. ADMIN_AUTH_MODE
    if (data.ADMIN_AUTH_MODE !== 'strict') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ADMIN_AUTH_MODE must be strict in production/staging',
        path: ['ADMIN_AUTH_MODE'],
      });
    }

    // 8. ADMIN_BEARER_TOKEN
    if (!data.ADMIN_BEARER_TOKEN || data.ADMIN_BEARER_TOKEN.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ADMIN_BEARER_TOKEN is required in production/staging',
        path: ['ADMIN_BEARER_TOKEN'],
      });
    } else if (data.ADMIN_BEARER_TOKEN.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ADMIN_BEARER_TOKEN must be at least 32 characters long in production/staging',
        path: ['ADMIN_BEARER_TOKEN'],
      });
    } else if (isWeakSecret(data.ADMIN_BEARER_TOKEN)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ADMIN_BEARER_TOKEN uses a known insecure default or weak pattern in production/staging',
        path: ['ADMIN_BEARER_TOKEN'],
      });
    }
  } else {
    // Development / Test validation rules
    if (data.NODE_ENV !== 'test' && data.JWT_SECRET && data.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET must be at least 32 characters long in non-test environments',
        path: ['JWT_SECRET'],
      });
    }

    if (data.ADMIN_AUTH_MODE === 'strict') {
      if (!data.ADMIN_BEARER_TOKEN || data.ADMIN_BEARER_TOKEN.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ADMIN_BEARER_TOKEN must be at least 32 characters when ADMIN_AUTH_MODE is strict',
          path: ['ADMIN_BEARER_TOKEN'],
        });
      }
    }
  }
}));

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function loadAppConfig(env: Record<string, string | undefined> = process.env): Readonly<AppConfig> {
  const result = AppConfigSchema.safeParse(env);
  if (!result.success) {
    const messages = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
    throw new Error(`Configuration validation failed:\n${messages}`);
  }
  return Object.freeze(result.data);
}

