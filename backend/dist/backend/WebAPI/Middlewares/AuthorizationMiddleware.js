"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
// Middleware de autorização
function authorizationMiddleware(req, res, next) {
    next(); // Passa para o próximo middleware
}
exports.authorizationMiddleware = authorizationMiddleware;
