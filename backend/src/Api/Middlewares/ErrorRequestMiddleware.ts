import { NextFunction, Request, Response } from 'express';

//Middleware de tratamento de erro
export function errorRequestMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).send({ error: err.message });
}
