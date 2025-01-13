"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const InvalidTokenError_1 = __importDefault(require("../errors/InvalidTokenError"));
const constants_1 = require("../errors/constants");
class GoogleAuthenticateService {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
    }
    async getIdToken(authorizationCode) {
        try {
            const { tokens } = await this.client.getToken(authorizationCode);
            if (!tokens.id_token) {
                throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
            }
            return tokens.id_token;
        }
        catch (error) {
            throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
        }
    }
    async getPayloadFromToken(idToken) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            if (!ticket || !ticket.getPayload()) {
                throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
            }
            return ticket.getPayload();
        }
        catch (error) {
            throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
        }
    }
}
exports.default = GoogleAuthenticateService;
