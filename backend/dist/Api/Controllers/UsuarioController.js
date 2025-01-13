"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const HandleErrors_1 = __importDefault(require("../../Application/errors/HandleErrors"));
class UsuarioController {
    constructor(service) {
        this.getById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const resultado = await this.service.getUsuarioById(id);
                if (!resultado) {
                    return res.status(404).json({ message: 'Usuario não encontrado.' });
                }
                res.json(resultado);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.getAll = async (_, res) => {
            try {
                const result = await this.service.getUsuarios();
                if (result.length === 0) {
                    return res.status(404).json({ message: 'Nenhum Usuario encontrado' });
                }
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.registrar = async (req, res, next) => {
            try {
                const { nome, email, senha } = req.body;
                await this.service.register(nome, email, senha);
                res.status(201).json({ message: 'Usuario criado com sucesso.' });
            }
            catch (error) {
                HandleErrors_1.default.handleErrors(error, req, res, next);
            }
        };
        this.update = async (req, res) => {
            try {
                const usuario = req.body;
                await this.service.updateUsuario(usuario);
                res.status(200).json({ message: 'Usuario atualizado com sucesso.' });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Usuario não encontrado') {
                    return res.status(404).json({ message: error.message });
                }
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.delete = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                await this.service.deleteUsuario(id);
                res.status(200).json({ message: 'Usuario deletado com sucesso.' });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Usuario não encontrado') {
                    return res.status(400).json({ error: error.message });
                }
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.getPerfil = async (req, res) => {
            try {
                const userId = parseInt(req.user.userId);
                const resultado = await this.service.getPerfil(userId);
                if (!resultado) {
                    return res.status(404).json({ message: 'Perfil não encontrado.' });
                }
                res.json(resultado);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.editarDados = async (req, res) => {
            try {
                const userId = parseInt(req.user.userId);
                const usuarioDados = req.body;
                if (!req.file && Object.keys(req.body).length === 0) {
                    return res.status(400).json({ message: 'Nenhum dado enviado para atualização.' });
                }
                const file = req.file;
                await this.service.editarDados(userId, usuarioDados, file);
                res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Perfil não encontrado') {
                    return res.status(404).json({ message: error.message });
                }
                res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
            }
        };
        this.generateResetUserPasswordToken = async (req, res, next) => {
            try {
                const response = await this.service.createResetUserPassword(req.body?.email);
                res.status(200).json({
                    message: response.message
                });
            }
            catch (error) {
                HandleErrors_1.default.handleErrors(error, req, res, next);
            }
        };
        /**
         * Criar lógica para resetar senha do usuario
         */
        this.resetPassword = async (req, res, next) => {
            try {
                const response = await this.service.updateUserPassword(req.body?.password, req.body?.passwordRepeated, req.params?.token);
                res.status(201).json({
                    message: response.message
                });
            }
            catch (error) {
                HandleErrors_1.default.handleErrors(error, req, res, next);
            }
        };
        this.service = service;
    }
}
exports.UsuarioController = UsuarioController;
