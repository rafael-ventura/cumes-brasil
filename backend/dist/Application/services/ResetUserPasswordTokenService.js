"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetUserPasswordTokenService = void 0;
const typedi_1 = require("typedi");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const js_base64_1 = require("js-base64");
const crypto_1 = __importDefault(require("crypto"));
const TokenValidation_1 = __importDefault(require("../validations/TokenValidation"));
let ResetUserPasswordTokenService = class ResetUserPasswordTokenService {
    generate(user) {
        console.log("process.env.secret_key:", process.env.SECRET_KEY);
        const jwtToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email
        }, process.env.SECRET_KEY ? process.env.SECRET_KEY : "", {
            expiresIn: "12h"
        });
        console.log("jwtToken:", jwtToken);
        const token = js_base64_1.Base64.encodeURI(jwtToken);
        const smallUrl = crypto_1.default.randomBytes(64).toString('base64url');
        return {
            jwtToken: jwtToken,
            tokenEncoded: token,
            smallUrl
        };
    }
    isTokenValid(resetPasswordToken) {
        TokenValidation_1.default.isBase64Valid(resetPasswordToken);
        const userJwtToken = js_base64_1.Base64.decode(resetPasswordToken);
        return TokenValidation_1.default.isJWTValid(userJwtToken);
    }
};
exports.ResetUserPasswordTokenService = ResetUserPasswordTokenService;
exports.ResetUserPasswordTokenService = ResetUserPasswordTokenService = __decorate([
    (0, typedi_1.Service)()
], ResetUserPasswordTokenService);
