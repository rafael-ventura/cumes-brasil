import { ImagemDTO } from "../Imagem/ImagemDTO";
import {Via} from "../../../Domain/entities/Via";

export class ViaDTO {
    id: number;
    nome: string;
    grau?: string;
    extensao?: number;
    conquistadores?: string;
    detalhes?: string;
    data?: string;

    // Campos adicionados
    crux?: string;
    artificial?: string;
    duracao?: string;
    exposicao?: string;
    viaPrincipalId?: number;
    fonteId?: number;

    imagem?: ImagemDTO;
    montanhaId?: number;
    faceId?: number;

    // Relações como arrays de IDs
    variantesIds?: number[];
    viaCroquisIds?: number[];
    viaColacoesIds?: number[];
    escaladasIds?: number[];

    constructor(entity: Via) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.grau = entity.grau;
        this.extensao = entity.extensao ? Number(entity.extensao) : undefined;
        this.conquistadores = entity.conquistadores;
        this.detalhes = entity.detalhes;
        this.data = entity.data;

        // Novos campos
        this.crux = entity.crux;
        this.artificial = entity.artificial;
        this.duracao = entity.duracao;
        this.exposicao = entity.exposicao;
        this.viaPrincipalId = (entity.viaPrincipal as any)?.id ?? entity.viaPrincipal;
        this.fonteId = (entity.fonte as any)?.id ?? entity.fonte;

        // imagem (transforma para URL final)
        this.imagem = entity.imagem
            ? new ImagemDTO(entity.imagem as any)
            : undefined;

        // se quiser simplificar as relações (não trazer objeto inteiro)
        this.montanhaId = (entity.montanha as any)?.id ?? entity.montanha;
        this.faceId = (entity.face as any)?.id ?? entity.face;

        // Arrays de relações
        this.variantesIds = entity.variantes?.map(v => v.id);
        this.viaCroquisIds = entity.viaCroquis?.map(vc => vc.id);
        this.viaColacoesIds = entity.viaColecoes?.map(vc => vc.id);
        this.escaladasIds = entity.escaladas?.map(e => e.id);
    }
}
