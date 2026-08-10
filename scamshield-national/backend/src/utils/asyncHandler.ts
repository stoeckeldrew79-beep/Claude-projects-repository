import { NextFunction, Request, RequestHandler, Response } from 'express';

// Express 4 does not catch rejections from async middleware/handlers —
// an unhandled rejection there crashes the whole process (confirmed by
// hand: a single malformed request took the entire dev server down).
// Wrap every async handler with this so errors reach the error middleware
// via next(err) instead.
export function asyncHandler<Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };
}
