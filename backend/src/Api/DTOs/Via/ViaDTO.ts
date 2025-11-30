import { ImagemDTO } from "../Imagem/ImagemDTO";
import { FonteDTO } from "../Fonte/FonteDTO";
import { LocalizacaoDTO } from "../Localizacao/LocalizacaoDTO";
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
    localizacao?: LocalizacaoDTO;
    fonte?: FonteDTO;
    via_principal?: { id: number; nome: string; grau?: string };
    
    // Coordenadas geográficas
    latitude?: number;
    longitude?: number;

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
        
        // Coordenadas geográficas
        this.latitude = entity.latitude ? Number(entity.latitude) : undefined;
        this.longitude = entity.longitude ? Number(entity.longitude) : undefined;

        // Localizacao
        if (entity.localizacao && typeof entity.localizacao === 'object') {
            this.localizacao = new LocalizacaoDTO(entity.localizacao);
        }

        // Lógica de fallback de imagem:
        // 1. Se a via tem imagem (carregada como objeto), usar ela
        // 2. Se não tem, usar imagem default
        const viaImagem = entity.imagem && typeof entity.imagem === 'object' && (entity.imagem as any).url 
            ? entity.imagem 
            : null;

        if (viaImagem) {
            // Usar imagem da via
            this.imagem = new ImagemDTO(viaImagem as any);
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

        this.fonte = entity.fonte && typeof entity.fonte === 'object'
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
