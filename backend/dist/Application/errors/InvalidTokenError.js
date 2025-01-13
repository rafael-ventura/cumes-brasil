"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTokenError";
        this.status = 404;
    }
}
exports.default = InvalidTokenError;
