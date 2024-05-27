"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
class UsuarioController {
    constructor(service) {
        /**
         * @route GET /usuarios/:id
         * @group Usuarios - Operações relacionadas a Usuarios
         * @returns {Usuario.model} 200 - Usuario encontrada
         * @returns {object} 404 - Usuario não encontrado
         * @returns {Error} 500 - Ocorreu um erro desconhecido
         */
        this.getById = async (requisicao, resposta) => {
            try {
                const id = parseInt(requisicao.params.id);
                const resultado = await this.service.getUsuarioById(id);
                if (!resultado) {
                    return resposta.status(404).json({ message: "Usuario não encontrada." });
                }
                resposta.json(resultado);
            }
            catch (error) {
                if (error instanceof Error) {
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route GET /usuarios
         * @group Usuarios - Operações relacionadas a Usuarios
         * @returns {Array.<Usuario>} 200 - Usuarios encontradas
         * @returns {object} 404 - Usuarios não encontrados
         * @returns {Error} 500 - Ocorreu um erro desconhecido
         */
        this.getAll = async (_, resposta) => {
            try {
                const result = await this.service.getUsuarios();
                if (result?.length === 0) {
                    return resposta.status(404).json({ message: "Nenhum usuario encontrado" });
                }
                resposta.json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route POST /usuarios
         * @group Usuarios - Operações relacionadas a Usuarios
         * @returns {object} 200 - Usuario criada com sucesso.
         * @returns {Error} 500 - Ocorreu um erro desconhecido
         */
        this.registrar = async (requisicao, resposta) => {
            try {
                const { nome, email, senha } = requisicao.body;
                await this.service.register(nome, email, senha);
                resposta.status(201).json({ message: "Usuario criado com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route PUT /usuarios
         * @group Usuarios - Operações relacionadas a Usuarios
         * @returns {object} 200 - Usuario atualizada com sucesso
         * @returns {object} 404 -message error
         * @returns {Error} 500 - Ocorreu um erro desconhecido
         */
        this.update = async (requisicao, resposta) => {
            try {
                const usuario = requisicao.body;
                await this.service.updateUsuario(usuario);
                resposta.status(200).json({ message: "Usuario atualizada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Usuario não encontrada") {
                        return resposta.status(404).json({ message: error.message });
                    }
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route DELETE /usuarios/:id
         * @group Usuarios - Operações relacionadas a Usuarios
         * @returns {Usuario.model} 200 - Usuario deletada com sucesso
         * @returns {object} 404 -message error
         * @returns {Error} 500 - Ocorreu um erro desconhecido
         */
        this.delete = async (requisicao, resposta) => {
            try {
                const id = parseInt(requisicao.params.id);
                await this.service.deleteUsuario(id);
                resposta.status(200).json({ message: "Usuario deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Usuario não encontrada") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        //get perfil
        this.getPerfil = async (requisicao, resposta) => {
            try {
                const userId = parseInt(requisicao.params.id);
                const resultado = await this.service.getPerfil(userId);
                if (!resultado) {
                    return resposta.status(404).json({ message: "Perfil não encontrado." });
                }
                resposta.json(resultado);
            }
            catch (error) {
                if (error instanceof Error) {
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        this.service = service;
    }
}
exports.UsuarioController = UsuarioController;
