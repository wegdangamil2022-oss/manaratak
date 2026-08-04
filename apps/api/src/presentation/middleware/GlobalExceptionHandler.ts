import { Request, Response, NextFunction } from 'express';
import { ILogger, ILogContext, IErrorSerializer } from '@manaratak/core';
import { PresentationErrorTranslator } from '../errors/PresentationErrorTranslator';

export class GlobalExceptionHandler {
  constructor(
    private readonly logger: ILogger,
    private readonly logContext: ILogContext,
    private readonly errorSerializer: IErrorSerializer
  ) {}

  public generate = () => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      const traceId = this.logContext.getCorrelationId() || 'unknown';
      
      this.logger.error(`Unhandled Exception: ${err.message}`, err, {
        path: req.originalUrl,
        method: req.method,
        traceId
      });

      const serialized = this.errorSerializer.serialize(err, traceId);
      const statusCode = PresentationErrorTranslator.translateToStatusCode(serialized.code);
      const responseBody = PresentationErrorTranslator.formatResponse(serialized);

      res.status(statusCode).json(responseBody);
    };
  }
}
