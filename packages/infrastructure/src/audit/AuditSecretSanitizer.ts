const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'password_hash',
  'token',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'secret',
  'apikey',
  'api_key',
  'bearer',
  'authorization',
  'databaseurl',
  'database_url',
  'jwt_secret',
  'admin_bearer_token',
  'creditcard',
  'credit_card'
]);

export class AuditSecretSanitizer {
  public static sanitize<T>(input: T): T {
    if (input === null || input === undefined) {
      return input;
    }

    if (typeof input !== 'object') {
      return input;
    }

    if (input instanceof Date) {
      return new Date(input.getTime()) as unknown as T;
    }

    if (Array.isArray(input)) {
      return input.map(item => AuditSecretSanitizer.sanitize(item)) as unknown as T;
    }

    const sanitizedObj: Record<string, any> = {};
    const obj = input as Record<string, any>;

    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitizedObj[key] = '[REDACTED]';
      } else {
        sanitizedObj[key] = AuditSecretSanitizer.sanitize(obj[key]);
      }
    }

    return sanitizedObj as T;
  }
}
