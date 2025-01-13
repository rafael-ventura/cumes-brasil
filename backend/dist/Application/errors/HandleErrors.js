"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class HandleErrors {
    static handleErrors(error, req, res, next) {
        const status = error?.status || 500;
        res.status(status).json({
            message: error.message || constants_1.errorsMessage.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.default = HandleErrors;
