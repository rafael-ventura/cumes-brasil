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

    imagem?: ImagemDTO;
    montanha?: MontanhaDTO;
    face?: any;
    fonte?: any;
    via_principal?: any;
    croquis?: any[];

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
    }
}
