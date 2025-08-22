import {ImagemDTO} from "../Imagem/ImagemDTO";
import {Usuario} from "../../../Domain/entities/Usuario";

export class UsuarioDTO {
    id: number;
    nome: string;
    email: string;
    idade?: number;
    biografia?: string;
    clube_organizacao?: string;
    localizacao?: string;
    foto_perfil?: ImagemDTO;

    constructor(entity: Usuario) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.email = entity.email;
        this.idade = entity.idade;
        this.biografia = entity.biografia;
        this.clube_organizacao = entity.clube_organizacao;
        this.localizacao = entity.localizacao;

        this.foto_perfil = entity.foto_perfil
            ? new ImagemDTO(entity.foto_perfil as any)
            : undefined;
    }
}
