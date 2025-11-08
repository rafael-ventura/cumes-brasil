import { ImagemDTO } from "../Imagem/ImagemDTO";
import { MontanhaDTO } from "../Montanha/MontanhaDTO";
import {Via} from "../../../Domain/entities/Via";

export class ViaDTO {
    id: number;
    nome: string;
    grau?: string;
    crux?: string;
    artificial?: string;
    duracao?: string;
    exposicao?: string;
    extensao?: number;
    conquistadores?: string;
    detalhes?: string;
    data?: string;

    viaPrincipalId?: number;
    fonteId?: number;

    imagem?: ImagemDTO;
    montanha?: MontanhaDTO;
    face?: any;
    fonte?: any;
    via_principal?: any;
    croquis?: any[];

    // Relações como arrays de IDs
    variantesIds?: number[];
    viaCroquisIds?: number[];
    viaColacoesIds?: number[];
    escaladasIds?: number[];

    constructor(entity: Via) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.grau = entity.grau;
        this.crux = entity.crux;
        this.artificial = entity.artificial;
        this.duracao = entity.duracao;
        this.exposicao = entity.exposicao;
        this.extensao = entity.extensao ? Number(entity.extensao) : undefined;
        this.conquistadores = entity.conquistadores;
        this.detalhes = entity.detalhes;
        this.data = entity.data;

        // IDs das relações
        this.viaPrincipalId = (entity.viaPrincipal as any)?.id ?? entity.viaPrincipal;
        this.fonteId = (entity.fonte as any)?.id ?? entity.fonte;

        // Passar objetos COMPLETOS como o Repository carrega
        this.imagem = entity.imagem ? new ImagemDTO(entity.imagem as any) : undefined;
        this.montanha = entity.montanha ? new MontanhaDTO(entity.montanha as any) : undefined;
        this.face = entity.face || null;
        this.fonte = entity.fonte || null;
        this.via_principal = entity.viaPrincipal || null;
        
        // Mapear croquis corretamente (viaCroquis -> croquis)
        if (entity.viaCroquis && Array.isArray(entity.viaCroquis)) {
            this.croquis = entity.viaCroquis.map((vc: any) => vc.croqui).filter(Boolean);
        } else {
            this.croquis = [];
        }

        // Arrays de relações
        this.variantesIds = entity.variantes?.map(v => v.id);
        this.viaCroquisIds = entity.viaCroquis?.map(vc => vc.id);
        this.viaColacoesIds = entity.viaColecoes?.map(vc => vc.id);
        this.escaladasIds = entity.escaladas?.map(e => e.id);
    }
}
