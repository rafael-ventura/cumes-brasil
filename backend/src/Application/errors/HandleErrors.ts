import { NextFunction, Request, Response } from "express";
import { errorsMessage } from "./constants";


export default class HandleErrors {
    static handleErrors(error: any, req: Request, res: Response, next: NextFunction) {
        const status = error?.status || 500;
        res.status(status).json({
            message: error.message || errorsMessage.INTERNAL_SERVER_ERROR,
        });
    }
}