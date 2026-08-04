import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ISecurityService } from '@manaratak/core';
import { ConfigurationRegistry } from '@manaratak/config';
import { timingSafeEqual } from 'node:crypto';

export interface CorsOptions {
  allowedOrigins: string[];
}

export interface CspOptions {
  enabled: boolean;
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface CsrfGuardOptions {
  getSessionSecret?: (req: Request) => string;
  headerName?: string;
  exemptPaths?: string[];
}

export interface AdminGuardOptions {
  mode: 'demo' | 'strict';
  bearerToken?: string;
}

export interface AdminRuntimeContext {
  readonly authMode: 'demo' | 'strict';
  readonly role: 'DEMO_SUPER_ADMIN' | 'STRICT_SUPER_ADMIN';
  readonly permissions: readonly string[];
}

export class SecurityMiddlewareFactory {
  public static createSecurityHeaders(options: CspOptions) {
    return helmet({
      contentSecurityPolicy: options.enabled ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      } : false,
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: true,
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: true,
      ieNoOpen: true,
      noSniff: true,
      permittedCrossDomainPolicies: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true
    });
  }

  public static createCors(options: CorsOptions) {
    return cors({
      origin: options.allowedOrigins.includes('*') ? '*' : options.allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token', 'x-csrf-token', 'X-Session-Secret', 'x-session-secret'],
      credentials: true,
      maxAge: 86400
    });
  }

  public static createRateLimiter(securityService: ISecurityService, options: RateLimitOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.socket?.remoteAddress || 'unknown';
      const result = await securityService.getRateLimiter().consume(ip, options.limit, options.windowMs);
      
      res.setHeader('X-RateLimit-Limit', options.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetTime);

      if (!result.allowed) {
        res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.'
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
      
      next();
    };
  }

  public static createCsrfGuard(securityService: ISecurityService, options: CsrfGuardOptions = {}) {
    const headerName = options.headerName || 'x-csrf-token';
    const getSessionSecret = options.getSessionSecret || ((req: Request) => {
      const configSecret = ConfigurationRegistry.isInitialized()
        ? ConfigurationRegistry.getOptionalInstance()?.getOptional<string>('SESSION_SECRET')
        : undefined;
      return (req.headers['x-session-secret'] as string)
        || (req as any).session?.secret
        || configSecret
        || process.env.SESSION_SECRET
        || '';
    });
    const exemptPaths = options.exemptPaths || [];

    return (req: Request, res: Response, next: NextFunction) => {
      const method = req.method.toUpperCase();

      // Safe HTTP methods (GET, HEAD, OPTIONS) do not mutate state and are allowed without CSRF token
      if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        next();
        return;
      }

      // Check for exempted path prefixes if provided
      if (exemptPaths.some((p) => req.path.startsWith(p))) {
        next();
        return;
      }

      // Extract CSRF token from header (e.g. X-CSRF-Token or x-csrf-token) or body/query fallback
      const token = (
        req.get(headerName) ||
        req.get('x-csrf-token') ||
        req.get('csrf-token') ||
        req.body?._csrf ||
        req.query?._csrf
      ) as string | undefined;

      const sessionSecret = getSessionSecret(req);

      if (!token || !securityService.validateCsrfToken(token, sessionSecret)) {
        res.status(403).json({
          error: {
            code: 'CSRF_TOKEN_INVALID',
            message: 'Invalid or missing CSRF token.',
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      next();
    };
  }

  public static resolveAdminAuthMode(env: Record<string, string | undefined> = process.env): 'demo' | 'strict' {
    const rawMode = env.ADMIN_AUTH_MODE;
    const isProduction = env.NODE_ENV === 'production';

    if (isProduction) {
      if (!rawMode || (rawMode !== 'strict' && rawMode !== 'bearer')) {
        throw new Error(
          `[Security Guardrail] In production (NODE_ENV=production), ADMIN_AUTH_MODE must be set to 'strict' or 'bearer'. Received: '${rawMode ?? 'unset'}'. Demo admin auth mode is forbidden in production.`
        );
      }
      return 'strict';
    }

    if (!rawMode) {
      console.warn(`[Security Guardrail Warning] ADMIN_AUTH_MODE is unset in non-production environment. Defaulting to 'demo' mode for local preview.`);
      return 'demo';
    }

    if (rawMode === 'demo') {
      return 'demo';
    }

    if (rawMode === 'strict' || rawMode === 'bearer') {
      return 'strict';
    }

    throw new Error(`[Security Guardrail] Invalid ADMIN_AUTH_MODE value: '${rawMode}'. Must be 'demo', 'strict', or 'bearer'.`);
  }

  public static createAdminGuard(options: AdminGuardOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (options.mode === 'demo') {
        assignAdminContext(res, {
          authMode: 'demo',
          role: 'DEMO_SUPER_ADMIN',
          permissions: ['admin:*'],
        });
        res.setHeader('X-Admin-Auth-Mode', 'demo');
        next();
        return;
      }

      const expectedToken = options.bearerToken;
      const receivedToken = extractBearerToken(req.headers.authorization);

      if (!expectedToken || !receivedToken || !safeEquals(receivedToken, expectedToken)) {
        res.status(401).json({
          error: {
            code: 'ADMIN_AUTH_REQUIRED',
            message: 'Admin authentication is required.',
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      assignAdminContext(res, {
        authMode: 'strict',
        role: 'STRICT_SUPER_ADMIN',
        permissions: ['admin:*'],
      });
      res.setHeader('X-Admin-Auth-Mode', 'strict');
      next();
    };
  }

  public static createAdminPermissionGuard(requiredPermission: string) {
    return (_req: Request, res: Response, next: NextFunction) => {
      const context = getAdminContext(res);
      if (!context) {
        res.status(403).json({
          error: {
            code: 'ADMIN_PERMISSION_REQUIRED',
            message: 'Admin permission context is required.',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requiredPermission,
          },
        });
        return;
      }

      const hasPermission = context.permissions.includes('admin:*') || context.permissions.includes(requiredPermission);
      if (!hasPermission) {
        res.status(403).json({
          error: {
            code: 'ADMIN_PERMISSION_DENIED',
            message: 'Admin permission is denied.',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requiredPermission,
          },
        });
        return;
      }

      res.setHeader('X-Admin-Required-Permission', requiredPermission);
      next();
    };
  }
}

function assignAdminContext(res: Response, context: AdminRuntimeContext): void {
  res.locals.adminContext = context;
}

function getAdminContext(res: Response): AdminRuntimeContext | null {
  return res.locals.adminContext ?? null;
}

function extractBearerToken(value: string | undefined): string | null {
  if (!value) return null;
  const [scheme, token] = value.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

function safeEquals(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(receivedBuffer, expectedBuffer);
}
