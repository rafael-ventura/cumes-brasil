import {ImagemDTO} from "../Imagem/ImagemDTO";
import {Usuario} from "../../../Domain/entities/Usuario";
import {ViaDTO} from "../Via/ViaDTO";

export class UsuarioDTO {
    id: number;
    nome: string;
    email: string;
    idade?: number;
    biografia?: string;
    clube_organizacao?: string;
    localizacao?: string;
    data_atividade?: string;
    foto_perfil?: ImagemDTO;
    via_preferida?: ViaDTO;

    constructor(entity: Usuario) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.email = entity.email;
        this.idade = entity.idade;
        this.biografia = entity.biografia;
        this.clube_organizacao = entity.clube_organizacao;
        this.localizacao = entity.localizacao;
        this.data_atividade = entity.data_atividade;

        this.foto_perfil = entity.foto_perfil
            ? new ImagemDTO(entity.foto_perfil as any)
            : undefined;

        // Incluir via_preferida completa usando ViaDTO
        this.via_preferida = entity.via_preferida && typeof entity.via_preferida === 'object'
            ? new ViaDTO(entity.via_preferida as any)
            : undefined;
    }
}
