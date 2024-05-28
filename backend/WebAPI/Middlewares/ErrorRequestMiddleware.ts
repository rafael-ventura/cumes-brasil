import { Request, Response, NextFunction } from 'express';

//Middleware de tratamento de erro
export function errorRequestMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err);

    res.status(500).send({ error: err.message });
}