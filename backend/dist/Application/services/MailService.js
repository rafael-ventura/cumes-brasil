"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const typedi_1 = require("typedi");
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const InternalServerError_1 = __importDefault(require("../errors/InternalServerError"));
const constants_1 = require("../errors/constants");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
let MailService = class MailService {
    constructor() { }
    /**
     * retornar mensagem: E-mail com passo-a-passo de redefinição de senha enviado com sucesso em caso de sucesso
     * @param nome
     * @param email
     * @param url
     * @returns
     */
    async sendResetUserPassword(nome, email, url) {
        url = this.buildFullResetUserPasswordUrl(url);
        this.buildMailService();
        const sourceTemplatePath = path_1.default.resolve(__dirname, '../../Domain/templates/resetPasswordMailTemplate.html');
        const sourceTemplate = fs_1.default.readFileSync(sourceTemplatePath, 'utf-8').toString();
        const template = handlebars_1.default.compile(sourceTemplate);
        const replacements = {
            nome,
            email,
            url,
        };
        const htmlWithTemplate = template(replacements);
        this.buildResetPasswordMailOptions(email, nome, url, htmlWithTemplate);
        this.transporter = nodemailer_1.default.createTransport(this.transporterConfigOptions);
        try {
            await this.transporter.sendMail(this.mailOptions);
            return {
                message: constants_1.successMessage.USER_RESET_PASSWORD_TOKEN_SENT
            };
        }
        catch (error) {
            throw new InternalServerError_1.default(constants_1.errorsMessage.EMAIL_SERVER_ERROR);
        }
    }
    getBooleanEnv(varName, defaultValue = false) {
        const value = process.env[varName];
        if (value) {
            return value.toLocaleLowerCase() === 'true';
        }
        else {
            return defaultValue;
        }
    }
    buildMailService() {
        const isOauth2Enabled = this.getBooleanEnv('OAUTH2_ENABLED');
        if (isOauth2Enabled) {
            // this.generateOAUTH2Config();
            this.buildTransporterConfigOAUTH2();
        }
        else {
            this.buildTransporterConfigDefault();
        }
    }
    /**
     * Lógica para gerar em tempo de execução o accesstoken pela api do google Não funcionou...
     * Fica como melhoria no futuro
     */
    generateOAUTH2Config() {
        const OAuth2 = googleapis_1.google.auth.OAuth2;
        this.oauth2Client = new OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
        this.oauth2Client.setCredentials({
            refresh_token: process.env.OAUTH_REFRESH_TOKEN
        });
    }
    buildTransporterConfigOAUTH2() {
        this.transporterConfigOptions = {
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USER,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: process.env.OAUTH_ACCESS_TOKEN
            },
        };
    }
    buildTransporterConfigDefault() {
        this.transporterConfigOptions = {
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, //true para porta 465
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
        };
    }
    buildResetPasswordMailOptions(receiverMail, receiverName, url, htmlToSend) {
        this.mailOptions = {
            from: this.transporterConfigOptions.auth.user,
            to: receiverMail,
            subject: 'Alteração de Senha',
            text: 'Alteracao de Senha',
            html: htmlToSend
        };
    }
    buildFullResetUserPasswordUrl(tokenUrl) {
        const baseUrl = process.env.WEB_HOSTNAME;
        const port = process.env.WEB_PORT;
        const resetPasswordPath = process.env.WEB_USER_RESET_PASSWORD_PATH;
        return `${baseUrl}:${port}/${resetPasswordPath}/${tokenUrl}`;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], MailService);
