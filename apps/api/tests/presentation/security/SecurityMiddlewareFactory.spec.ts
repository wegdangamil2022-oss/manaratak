import { describe, expect, it, vi } from 'vitest';
import { SecurityMiddlewareFactory } from '../../../src/presentation/security/SecurityMiddlewareFactory';
import { DefaultRateLimiter, SecurityService } from '@manaratak/infrastructure';

function createResponse() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    locals: {} as Record<string, unknown>,
    payload: undefined as unknown,
    setHeader: vi.fn(function (this: any, key: string, value: string) {
      this.headers[key] = value;
    }),
    status: vi.fn(function (this: any, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function (this: any, payload: unknown) {
      this.payload = payload;
      return this;
    }),
  };
}

describe('SecurityMiddlewareFactory admin guard', () => {
  it('allows demo mode and marks the response header', () => {
    const guard = SecurityMiddlewareFactory.createAdminGuard({ mode: 'demo' });
    const response = createResponse();
    const next = vi.fn();

    guard({ headers: {} } as any, response as any, next);

    expect(next).toHaveBeenCalled();
    expect(response.headers['X-Admin-Auth-Mode']).toBe('demo');
    expect(response.locals.adminContext).toEqual(expect.objectContaining({
      role: 'DEMO_SUPER_ADMIN',
      permissions: ['admin:*'],
    }));
  });

  it('rejects strict mode without a valid bearer token', () => {
    const guard = SecurityMiddlewareFactory.createAdminGuard({
      mode: 'strict',
      bearerToken: 'a-secure-admin-token-value-with-32chars',
    });
    const response = createResponse();

    guard({ headers: {} } as any, response as any, vi.fn());

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.payload).toEqual(expect.objectContaining({
      error: expect.objectContaining({ code: 'ADMIN_AUTH_REQUIRED' }),
    }));
  });

  it('allows strict mode with the configured bearer token', () => {
    const token = 'a-secure-admin-token-value-with-32chars';
    const guard = SecurityMiddlewareFactory.createAdminGuard({
      mode: 'strict',
      bearerToken: token,
    });
    const response = createResponse();
    const next = vi.fn();

    guard({ headers: { authorization: `Bearer ${token}` } } as any, response as any, next);

    expect(next).toHaveBeenCalled();
    expect(response.headers['X-Admin-Auth-Mode']).toBe('strict');
    expect(response.locals.adminContext).toEqual(expect.objectContaining({
      role: 'STRICT_SUPER_ADMIN',
      permissions: ['admin:*'],
    }));
  });

  it('allows admin permission guard when wildcard permission exists', () => {
    const guard = SecurityMiddlewareFactory.createAdminPermissionGuard('admin:scholarships:manage');
    const response = createResponse();
    response.locals.adminContext = {
      authMode: 'strict',
      role: 'STRICT_SUPER_ADMIN',
      permissions: ['admin:*'],
    };
    const next = vi.fn();

    guard({} as any, response as any, next);

    expect(next).toHaveBeenCalled();
    expect(response.headers['X-Admin-Required-Permission']).toBe('admin:scholarships:manage');
  });

  it('rejects admin permission guard when context is missing', () => {
    const guard = SecurityMiddlewareFactory.createAdminPermissionGuard('admin:finance:manage');
    const response = createResponse();

    guard({} as any, response as any, vi.fn());

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.payload).toEqual(expect.objectContaining({
      error: expect.objectContaining({ code: 'ADMIN_PERMISSION_REQUIRED' }),
    }));
  });

  it('rejects admin permission guard when permission is not granted', () => {
    const guard = SecurityMiddlewareFactory.createAdminPermissionGuard('admin:finance:manage');
    const response = createResponse();
    response.locals.adminContext = {
      authMode: 'strict',
      role: 'STRICT_SUPER_ADMIN',
      permissions: ['admin:scholarships:manage'],
    };

    guard({} as any, response as any, vi.fn());

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.payload).toEqual(expect.objectContaining({
      error: expect.objectContaining({ code: 'ADMIN_PERMISSION_DENIED' }),
    }));
  });
});

describe('SecurityMiddlewareFactory resolveAdminAuthMode', () => {
  it('throws configuration error when production has missing ADMIN_AUTH_MODE', () => {
    expect(() =>
      SecurityMiddlewareFactory.resolveAdminAuthMode({
        NODE_ENV: 'production',
      })
    ).toThrowError(/In production \(NODE_ENV=production\), ADMIN_AUTH_MODE must be set to 'strict' or 'bearer'/);
  });

  it('throws configuration error when production uses ADMIN_AUTH_MODE=demo', () => {
    expect(() =>
      SecurityMiddlewareFactory.resolveAdminAuthMode({
        NODE_ENV: 'production',
        ADMIN_AUTH_MODE: 'demo',
      })
    ).toThrowError(/Demo admin auth mode is forbidden in production/);
  });

  it('defaults to demo mode in non-production when ADMIN_AUTH_MODE is missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mode = SecurityMiddlewareFactory.resolveAdminAuthMode({
      NODE_ENV: 'development',
    });
    expect(mode).toBe('demo');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ADMIN_AUTH_MODE is unset'));
    consoleSpy.mockRestore();
  });

  it('resolves strict mode when NODE_ENV=production and ADMIN_AUTH_MODE=strict', () => {
    const mode = SecurityMiddlewareFactory.resolveAdminAuthMode({
      NODE_ENV: 'production',
      ADMIN_AUTH_MODE: 'strict',
    });
    expect(mode).toBe('strict');
  });

  it('resolves strict mode when NODE_ENV=production and ADMIN_AUTH_MODE=bearer', () => {
    const mode = SecurityMiddlewareFactory.resolveAdminAuthMode({
      NODE_ENV: 'production',
      ADMIN_AUTH_MODE: 'bearer',
    });
    expect(mode).toBe('strict');
  });
});

describe('SecurityMiddlewareFactory rate limiter middleware', () => {
  it('allows requests within rate limit and sets rate limit headers', async () => {
    const rateLimiter = new DefaultRateLimiter();
    const securityService = new SecurityService(rateLimiter);
    const middleware = SecurityMiddlewareFactory.createRateLimiter(securityService, {
      limit: 5,
      windowMs: 60000,
    });

    const response = createResponse();
    const next = vi.fn();
    const req = { ip: '1.2.3.4' } as any;

    await middleware(req, response as any, next);

    expect(next).toHaveBeenCalled();
    expect(response.headers['X-RateLimit-Limit']).toBe(5);
    expect(response.headers['X-RateLimit-Remaining']).toBe(4);
    expect(Number(response.headers['X-RateLimit-Reset'])).toBeGreaterThan(Date.now());
  });

  it('returns HTTP 429 Too Many Requests when rate limit is exceeded', async () => {
    const rateLimiter = new DefaultRateLimiter();
    const securityService = new SecurityService(rateLimiter);
    const limit = 2;
    const middleware = SecurityMiddlewareFactory.createRateLimiter(securityService, {
      limit,
      windowMs: 60000,
    });

    const req = { ip: '1.2.3.4' } as any;

    // First request - allowed
    const res1 = createResponse();
    const next1 = vi.fn();
    await middleware(req, res1 as any, next1);
    expect(next1).toHaveBeenCalled();
    expect(res1.headers['X-RateLimit-Remaining']).toBe(1);

    // Second request - allowed
    const res2 = createResponse();
    const next2 = vi.fn();
    await middleware(req, res2 as any, next2);
    expect(next2).toHaveBeenCalled();
    expect(res2.headers['X-RateLimit-Remaining']).toBe(0);

    // Third request - blocked with HTTP 429
    const res3 = createResponse();
    const next3 = vi.fn();
    await middleware(req, res3 as any, next3);

    expect(next3).not.toHaveBeenCalled();
    expect(res3.statusCode).toBe(429);
    expect(res3.headers['X-RateLimit-Remaining']).toBe(0);
    expect(res3.payload).toEqual({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
      },
      meta: {
        timestamp: expect.any(String),
      },
    });
  });

  it('tracks rate limits independently per IP address', async () => {
    const rateLimiter = new DefaultRateLimiter();
    const securityService = new SecurityService(rateLimiter);
    const middleware = SecurityMiddlewareFactory.createRateLimiter(securityService, {
      limit: 1,
      windowMs: 60000,
    });

    const reqIp1 = { ip: '192.168.0.1' } as any;
    const reqIp2 = { ip: '192.168.0.2' } as any;

    // IP 1 uses its limit
    const resIp1First = createResponse();
    const nextIp1First = vi.fn();
    await middleware(reqIp1, resIp1First as any, nextIp1First);
    expect(nextIp1First).toHaveBeenCalled();

    // IP 1 blocked on second attempt
    const resIp1Second = createResponse();
    const nextIp1Second = vi.fn();
    await middleware(reqIp1, resIp1Second as any, nextIp1Second);
    expect(nextIp1Second).not.toHaveBeenCalled();
    expect(resIp1Second.statusCode).toBe(429);

    // IP 2 is allowed
    const resIp2First = createResponse();
    const nextIp2First = vi.fn();
    await middleware(reqIp2, resIp2First as any, nextIp2First);
    expect(nextIp2First).toHaveBeenCalled();
    expect(resIp2First.statusCode).toBe(200);
  });
});

describe('SecurityMiddlewareFactory CSRF guard middleware', () => {
  const sessionSecret = 'test-session-secret-999';

  function createMockRequest(method: string, headers: Record<string, string> = {}, body?: any) {
    const normalizedHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      normalizedHeaders[k.toLowerCase()] = v;
    }

    return {
      method,
      path: '/api/v1/resource',
      headers: normalizedHeaders,
      get: (headerName: string) => normalizedHeaders[headerName.toLowerCase()],
      body: body || {},
      query: {},
    } as any;
  }

  it('allows safe methods (GET, HEAD, OPTIONS) without a CSRF token', async () => {
    const securityService = new SecurityService();
    const middleware = SecurityMiddlewareFactory.createCsrfGuard(securityService);

    for (const method of ['GET', 'HEAD', 'OPTIONS']) {
      const req = createMockRequest(method);
      const res = createResponse();
      const next = vi.fn();

      await middleware(req, res as any, next);

      expect(next).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
    }
  });

  it('rejects state-mutating methods (POST, PUT, PATCH, DELETE) when CSRF token is missing with HTTP 403', async () => {
    const securityService = new SecurityService();
    const middleware = SecurityMiddlewareFactory.createCsrfGuard(securityService);

    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const req = createMockRequest(method);
      const res = createResponse();
      const next = vi.fn();

      await middleware(req, res as any, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(403);
      expect(res.payload).toEqual({
        error: {
          code: 'CSRF_TOKEN_INVALID',
          message: 'Invalid or missing CSRF token.',
        },
        meta: {
          timestamp: expect.any(String),
        },
      });
    }
  });

  it('rejects state-mutating requests with invalid, malformed, or tampered CSRF tokens with HTTP 403', async () => {
    const securityService = new SecurityService();
    const middleware = SecurityMiddlewareFactory.createCsrfGuard(securityService);

    const invalidTokens = [
      'invalid-token-string',
      'demo-token',
      '12345.67890',
      '12345.abc.def.ghi',
    ];

    for (const token of invalidTokens) {
      const req = createMockRequest('POST', { 'X-CSRF-Token': token });
      const res = createResponse();
      const next = vi.fn();

      await middleware(req, res as any, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(403);
      expect(res.payload.error.code).toBe('CSRF_TOKEN_INVALID');
    }
  });

  it('allows state-mutating requests when a valid CSRF token is provided in X-CSRF-Token header', async () => {
    const securityService = new SecurityService();
    const middleware = SecurityMiddlewareFactory.createCsrfGuard(securityService, {
      getSessionSecret: () => sessionSecret,
    });

    const validToken = securityService.generateCsrfToken(sessionSecret);

    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const req = createMockRequest(method, { 'X-CSRF-Token': validToken });
      const res = createResponse();
      const next = vi.fn();

      await middleware(req, res as any, next);

      expect(next).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
    }
  });
});

