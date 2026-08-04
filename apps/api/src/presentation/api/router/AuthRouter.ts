import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { IAuthService, ISecurityService } from '@manaratak/core';
import { IIdentityRepository } from '@manaratak/domain';
import { ConfigurationRegistry } from '@manaratak/config';
import { ResponseFormatter } from '../response/ResponseFormatter';

export class AuthRouter {
  public static create({ 
    authService, 
    identityRepository,
    securityService
  }: { 
    authService: IAuthService; 
    identityRepository: IIdentityRepository; 
    securityService?: ISecurityService;
  }): Router {
    const router = Router();
    const responseFormatter = new ResponseFormatter('v1');

    // 0. GET /csrf-token
    router.get('/csrf-token', (req: Request, res: Response) => {
      const configSecret = ConfigurationRegistry.isInitialized()
        ? ConfigurationRegistry.getOptionalInstance()?.getOptional<string>('SESSION_SECRET')
        : undefined;
      const sessionSecret = (req.headers['x-session-secret'] as string)
        || (req as any).session?.secret
        || configSecret
        || process.env.SESSION_SECRET
        || '';
      const token = securityService ? securityService.generateCsrfToken(sessionSecret) : 'demo-token';
      res.setHeader('X-CSRF-Token', token);
      res.status(200).json(responseFormatter.success({
        csrfToken: token
      }));
    });

    // 1. POST /login
    router.post('/login', async (req: Request, res: Response) => {
      try {
        const schema = z.object({
          email: z.string().email('Invalid email address'),
          password: z.string().min(1, 'Password is required')
        });

        const parseResult = schema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json(responseFormatter.error({
            code: 'VALIDATION_ERROR',
            message: parseResult.error.issues[0]?.message || 'Validation failed'
          }));
          return;
        }

        const { email, password } = parseResult.data;
        const identity = await identityRepository.findByEmail(email);

        if (!identity) {
          res.status(401).json(responseFormatter.error({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials or identity not found'
          }));
          return;
        }

        let tokens;
        try {
          tokens = await (authService as any).login(identity.id.toString(), password);
        } catch (authError) {
          res.status(401).json(responseFormatter.error({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials or identity not found'
          }));
          return;
        }
        
        // Return only safe token fields
        res.status(200).json(responseFormatter.success({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }));
      } catch (error: any) {
        res.status(500).json(responseFormatter.error({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred during login'
        }));
      }
    });

    // 2. POST /refresh
    router.post('/refresh', async (req: Request, res: Response) => {
      try {
        const schema = z.object({
          refreshToken: z.string().min(1, 'Refresh token is required')
        });

        const parseResult = schema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json(responseFormatter.error({
            code: 'VALIDATION_ERROR',
            message: parseResult.error.issues[0]?.message || 'Validation failed'
          }));
          return;
        }

        const { refreshToken } = parseResult.data;
        const tokens = await authService.refreshTokens(refreshToken);

        res.status(200).json(responseFormatter.success({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }));
      } catch (error: any) {
        res.status(401).json(responseFormatter.error({
          code: 'INVALID_TOKEN',
          message: 'Session revoked, expired, or invalid refresh token'
        }));
      }
    });

    // 3. POST /logout
    router.post('/logout', async (req: Request, res: Response) => {
      try {
        const schema = z.object({
          userId: z.string().min(1, 'User ID is required'),
          refreshToken: z.string().min(1, 'Refresh token is required')
        });

        const parseResult = schema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json(responseFormatter.error({
            code: 'VALIDATION_ERROR',
            message: parseResult.error.issues[0]?.message || 'Validation failed'
          }));
          return;
        }

        const { userId, refreshToken } = parseResult.data;
        await authService.logout(userId, refreshToken);

        res.status(200).json(responseFormatter.success({
          message: 'Successfully logged out'
        }));
      } catch (error: any) {
        res.status(400).json(responseFormatter.error({
          code: 'LOGOUT_FAILED',
          message: 'Failed to revoke session'
        }));
      }
    });

    return router;
  }
}
export default AuthRouter;
