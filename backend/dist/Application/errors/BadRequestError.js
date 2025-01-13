"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.status = 404;
    }
}
exports.default = BadRequestError;
