"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRequestMiddleware = errorRequestMiddleware;
//Middleware de tratamento de erro
function errorRequestMiddleware(err, req, res, next) {
    console.log(err);
    res.status(500).send({ error: err.message });
}
