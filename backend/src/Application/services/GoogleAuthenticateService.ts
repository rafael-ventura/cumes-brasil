import { OAuth2Client } from 'google-auth-library';
import InvalidTokenError from '../errors/InvalidTokenError';
import { errorsMessage } from '../errors/constants';
import { Service } from 'typedi';

@Service()
export default class GoogleAuthenticateService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
    }

    async getIdToken(authorizationCode: string): Promise<string> {
        try {
            const { tokens } = await this.client.getToken(authorizationCode);
            if (!tokens.id_token) {
                throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
            }
            return tokens.id_token;

        } catch (error: any) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
        }
    }

    async getPayloadFromToken(idToken: string): Promise<any> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            if (!ticket || !ticket.getPayload()) {
                throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
            }

            return ticket.getPayload();
        } catch (error: any) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
        }

    }
}