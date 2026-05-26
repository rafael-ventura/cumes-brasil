import {ImagemDTO} from "../Imagem/ImagemDTO";
import {Usuario} from "../../../Domain/entities/Usuario";
import {ViaDTO} from "../Via/ViaDTO";

export class UsuarioDTO {
    id: number;
    nome: string;
    username?: string;
    email: string;
    idade?: number;
  biografia?: string;
  link_externo?: string | null;
  clube_organizacao?: string;
  localizacao?: string;
  perfil_publico?: boolean;
  conquistas_publico?: boolean;
  data_atividade?: string;
    foto_perfil?: ImagemDTO;
    via_preferida?: ViaDTO;

    constructor(entity: Usuario) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.username = entity.username ?? undefined;
        this.email = entity.email;
        this.idade = entity.idade;
        this.biografia = entity.biografia;
        this.link_externo = entity.link_externo ?? undefined;
        this.clube_organizacao = entity.clube_organizacao;
        this.localizacao = entity.localizacao;
        this.perfil_publico = entity.perfil_publico;
        this.conquistas_publico = entity.conquistas_publico;
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
