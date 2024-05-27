"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemService = void 0;
class ImagemService {
    constructor(imagemRepository) {
        this.imagemRepository = imagemRepository;
    }
    async getImagemById(id) {
        if (!id) {
            throw new Error("ID da Imagem não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Imagem inválido");
        }
        return this.imagemRepository.getById(id);
    }
    async getImagens() {
        return this.imagemRepository.getAll();
    }
    async createImagem(imagem) {
        if (!imagem) {
            throw new Error("Imagem inválida");
        }
        return this.imagemRepository.create(imagem);
    }
    async updateImagem(id, imagemData) {
        if (!id) {
            throw new Error("ID da Imagem não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Imagem inválido");
        }
        const existingImagem = await this.getImagemById(id);
        if (!existingImagem) {
            throw new Error("Imagem não encontrada");
        }
        await this.imagemRepository.update(id, imagemData);
    }
    async deleteImagem(id) {
        if (!id) {
            throw new Error("ID da Imagem não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Imagem inválido");
        }
        const existingImagem = await this.getImagemById(id);
        if (!existingImagem) {
            throw new Error("Imagem não encontrada");
        }
        await this.imagemRepository.delete(id);
    }
    async getByColecaoId(colecaoId) {
        return this.imagemRepository.getByColecaoId(colecaoId);
    }
    async getByUsuarioId(usuarioId) {
        return this.imagemRepository.getByUsuarioId(usuarioId);
    }
    async getByMontanhaId(montanhaId) {
        return this.imagemRepository.getByMontanhaId(montanhaId);
    }
    async getByViaId(viaId) {
        return this.imagemRepository.getByViaId(viaId);
    }
    async getByCroquiId(croquiId) {
        return this.imagemRepository.getByCroquiId(croquiId);
    }
}
exports.ImagemService = ImagemService;
