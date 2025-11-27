import { ImagemDTO } from "../Imagem/ImagemDTO";
import { MontanhaDTO } from "../Montanha/MontanhaDTO";
import { FaceDTO } from "../Face/FaceDTO";
import { FonteDTO } from "../Fonte/FonteDTO";
import { Via } from "../../../Domain/entities/Via";

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

    // Relações como objetos completos (informações essenciais)
    imagem?: ImagemDTO;
    montanha?: MontanhaDTO;
    face?: FaceDTO;
    fonte?: FonteDTO;
    via_principal?: { id: number; nome: string; grau?: string };

    // Arrays de IDs para relações de muitos-para-muitos
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

        // Montanha primeiro (precisa estar carregada para o fallback de imagem)
        this.montanha = entity.montanha 
            ? new MontanhaDTO(entity.montanha as any) 
            : undefined;

        // Lógica de fallback de imagem:
        // 1. Se a via tem imagem (carregada como objeto), usar ela
        // 2. Se não tem, usar a imagem da montanha (do MontanhaDTO que já foi criado)
        // 3. Se a montanha também não tem, usar imagem default
        const viaImagem = entity.imagem && typeof entity.imagem === 'object' && (entity.imagem as any).url 
            ? entity.imagem 
            : null;

        if (viaImagem) {
            // Usar imagem da via
            this.imagem = new ImagemDTO(viaImagem as any);
        } else if (this.montanha?.imagem) {
            // Usar imagem da montanha (já processada pelo MontanhaDTO)
            this.imagem = this.montanha.imagem;
        } else {
            // Usar imagem default para via
            // ID 4 corresponde à imagem default de via conforme dados iniciais
            const imagemDefault = {
                id: 4,
                url: "/assets/via-default-01.webp",
                descricao: "Foto Default para Via",
                tipo_entidade: "via"
            };
            this.imagem = new ImagemDTO(imagemDefault as any);
        }

        this.face = entity.face 
            ? new FaceDTO(entity.face as any) 
            : undefined;

        this.fonte = entity.fonte 
            ? new FonteDTO(entity.fonte as any) 
            : undefined;

        // Via principal simplificada (apenas info básica para evitar recursão)
        if (entity.viaPrincipal) {
            const vp = entity.viaPrincipal as any;
            this.via_principal = {
                id: vp.id,
                nome: vp.nome,
                grau: vp.grau
            };
        }

        // Arrays de relações (apenas IDs)
        this.variantesIds = entity.variantes?.map(v => v.id);
        this.viaCroquisIds = entity.viaCroquis?.map(vc => vc.id);
        this.viaColacoesIds = entity.viaColecoes?.map(vc => vc.id);
        this.escaladasIds = entity.escaladas?.map(e => e.id);
    }
}
