import { ImagemDTO } from '../Imagem/ImagemDTO';
import { Usuario } from '../../../Domain/entities/Usuario';
import { ViaDTO } from '../Via/ViaDTO';

/**
 * DTO para perfil público - não expõe email nem dados sensíveis.
 */
export class PerfilPublicoDTO {
    id: number;
    nome: string;
    username: string;
    biografia?: string;
    link_externo?: string | null;
    conquistas_publico?: boolean;
    clube_organizacao?: string;
    localizacao?: string;
    data_atividade?: string;
    foto_perfil?: ImagemDTO;
    via_preferida?: ViaDTO;
    /** Registros de terceiros em que o usuário foi marcado na cordada (username; qualquer papel), com autor de perfil público. */
    numEscaladas: number;
    numColecoes: number;
    numFavoritas: number;

    constructor(
        entity: Usuario,
        numEscaladas: number,
        numColecoes: number,
        numFavoritas: number
    ) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.username = entity.username ?? '';
        this.biografia = entity.biografia ?? undefined;
        this.link_externo = entity.link_externo ?? undefined;
        this.conquistas_publico = entity.conquistas_publico;
        this.clube_organizacao = entity.clube_organizacao ?? undefined;
        this.localizacao = entity.localizacao ?? undefined;
        this.data_atividade = entity.data_atividade ?? undefined;

        this.foto_perfil = entity.foto_perfil
            ? new ImagemDTO(entity.foto_perfil as any)
            : undefined;

        this.via_preferida = entity.via_preferida && typeof entity.via_preferida === 'object'
            ? new ViaDTO(entity.via_preferida as any)
            : undefined;

        this.numEscaladas = numEscaladas;
        this.numColecoes = numColecoes;
        this.numFavoritas = numFavoritas;
    }
}
