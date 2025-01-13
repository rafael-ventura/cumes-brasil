"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const constants_1 = require("../errors/constants");
const js_base64_1 = require("js-base64");
const InvalidTokenError_1 = __importDefault(require("../errors/InvalidTokenError"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
exports.default = {
    resetUserPasswordToken(token) {
        if (!token) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.USER_MAIL_TOKEN_INVALID);
        }
    },
    isBase64Valid(base64Token) {
        if (!js_base64_1.Base64.isValid(base64Token)) {
            throw new InvalidTokenError_1.default(constants_1.errorsMessage.USER_MAIL_TOKEN_INVALID);
        }
    },
    isJWTValid(jwtToken) {
        try {
            return jsonwebtoken_1.default.verify(jwtToken, process.env.SECRET_KEY ? process.env.SECRET_KEY : '');
        }
        catch (error) {
            console.log("erro validacao JWT", error.name, error.message);
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new InvalidTokenError_1.default(constants_1.jwtTokenErrorMessages[error.message]);
            }
            else {
                throw new InvalidTokenError_1.default(constants_1.errorsMessage.USER_MAIL_TOKEN_INVALID);
            }
        }
    }
};
