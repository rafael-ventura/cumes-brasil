"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const constants_1 = require("../errors/constants");
exports.default = {
    registerValidation(nome, email, password) {
        if (!nome || !email || !password) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_REQUEST);
        }
        if (password.length < 4) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_REQUEST);
        }
    },
    authenticateValidation(email, password) {
        if (!email || !password) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_REQUEST);
        }
    },
    generateResetPasswordValidation(email) {
        if (!email || email.length === 0) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_CREDENTIALS);
        }
    },
    resetPasswordValidation(newPassword, newPasswordRepeated) {
        if (!newPassword || !newPasswordRepeated) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_REQUEST);
        }
        if (newPassword !== newPasswordRepeated) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.BAD_CREDENTIALS);
        }
    }
};
