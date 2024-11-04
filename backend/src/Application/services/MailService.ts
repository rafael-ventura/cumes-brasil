import { Service } from "typedi";
import nodemailer, { Transporter } from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import InternalServerError from "../errors/InternalServerError";
import { errorsMessage, successMessage } from "../errors/constants";

@Service()
export class MailService {
    private transporter: Transporter;
    private transporterConfigOptions: any;
    private mailOptions: any;
    private oauth2Client: OAuth2Client;

    constructor() { }

    /**
     * retornar mensagem: E-mail com passo-a-passo de redefinição de senha enviado com sucesso em caso de sucesso
     * @param nome         
     * @param email 
     * @param url 
     * @returns 
     */
    async sendResetUserPassword(nome: string, email: string, url: string) {
        url = this.buildFullResetUserPasswordUrl(url);
        console.log("MailService.resetUserPassword executado", nome, email, url);
        this.buildMailService();
        this.buildResetPasswordMailOptions(email, nome, url);
        this.transporter = nodemailer.createTransport(this.transporterConfigOptions);
        try {
            await this.transporter.sendMail(this.mailOptions);
            return {
                message: successMessage.USER_RESET_PASSWORD_TOKEN_SENT
            };
        } catch (error) {
            throw new InternalServerError(errorsMessage.EMAIL_SERVER_ERROR);
        }
    }

    private getBooleanEnv(varName: string, defaultValue = false) {
        const value = process.env[varName];
        if (value) {
            return value.toLocaleLowerCase() === 'true';
        } else {
            return defaultValue;
        }
    }

    private buildMailService() {
        const isOauth2Enabled = this.getBooleanEnv('OAUTH2_ENABLED');
        if (isOauth2Enabled) {
            // this.generateOAUTH2Config();
            this.buildTransporterConfigOAUTH2();
        } else {
            this.buildTransporterConfigDefault();
        }
    }

    /**
     * Lógica para gerar em tempo de execução o accesstoken pela api do google Não funcionou... Estudarei mais a fundo mais pra frente
     */
    private generateOAUTH2Config(): void {
        const OAuth2 = google.auth.OAuth2;

        this.oauth2Client = new OAuth2(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            process.env.OAUTH_REDIRECT_URI
        );

        this.oauth2Client.setCredentials({
            refresh_token: process.env.OAUTH_REFRESH_TOKEN
        });

    }

    private async buildTransporterConfigOAUTH2(): Promise<void> {
        // const accessToken = await this.oauth2Client.getAccessToken();
        // console.log("accessToken", accessToken);
        this.transporterConfigOptions = {
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USER ? process.env.MAIL_USER : "junior.fool.skull@gmail.com",
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: process.env.OAUTH_ACCESS_TOKEN
            },
        }
    }

    private async buildTransporterConfigDefault(): Promise<void> {
        this.transporterConfigOptions = {
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, //true para porta 465
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
        }
    }

    private buildResetPasswordMailOptions(receiverMail: string, receiverName: string, url: string): void {
        this.mailOptions = {
            from: this.transporterConfigOptions.auth.user,
            to: receiverMail,
            subject: 'Alteração de Senha',
            html: `<h1>Olá! ${receiverName}</h1> 
            <p>Recebemos uma solicitação de senha referente ao email ${receiverMail} citado. 
            Para cadastrar uma nova senha, acesse o link abaixo</p>
            <a href="${url}" target="_blank"> link </a>`
        }
    }

    private buildFullResetUserPasswordUrl(tokenUrl: string) {
        const baseUrl = process.env.WEB_HOSTNAME;
        const port = process.env.WEB_PORT;
        const resetPasswordPath = process.env.WEB_USER_RESET_PASSWORD_PATH;

        return `${baseUrl}:${port}/${resetPasswordPath}/${tokenUrl}`;
    }

}