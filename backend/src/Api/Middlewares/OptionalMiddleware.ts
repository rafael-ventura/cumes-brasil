import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
        console.log("returned")
        return next();
    }

    jwt.verify(token, '8c7515be3e2a107dc0cf543889f045fb7df3177209ebfd0a2b966b6b6d9eb4d7', (err, decoded) => {
        if (!err) {
            req.user = decoded;
            console.log("decoded", req.user)
            return next();
        }

        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        }).then((ticket) => {
            req.user = ticket.getPayload();
            console.log("ticket", req.user)
            next();
        }).catch((error) => {
            // do nothing
        });
    });
}