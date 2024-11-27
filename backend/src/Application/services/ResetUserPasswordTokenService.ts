import { Service } from "typedi";
import { Usuario } from "../../Domain/entities/Usuario";
import jwt from "jsonwebtoken";
import { Base64 } from "js-base64";
import crypto from "crypto";
import TokenValidation from "../validations/TokenValidation";


@Service()
export class ResetUserPasswordTokenService {
    generate(user: Usuario) {
        console.log("process.env.secret_key:", process.env.SECRET_KEY);
        const jwtToken = jwt.sign({
                id: user.id,
                email: user.email
            },
            process.env.SECRET_KEY ? process.env.SECRET_KEY : "",
            {
                expiresIn: "12h"
            }
        );
    
        console.log("jwtToken:", jwtToken);
        
        const token = Base64.encodeURI(jwtToken);
        const smallUrl = crypto.randomBytes(64).toString('base64url');
        return {
            jwtToken: jwtToken,
            tokenEncoded: token,
            smallUrl
        }
    }


    isTokenValid(resetPasswordToken: string) {
        TokenValidation.isBase64Valid(resetPasswordToken);
        const userJwtToken = Base64.decode(resetPasswordToken);
        return TokenValidation.isJWTValid(userJwtToken);
    }
}