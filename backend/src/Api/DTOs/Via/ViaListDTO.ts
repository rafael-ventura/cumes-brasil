import { ImagemDTO } from "../Imagem/ImagemDTO";
import { Via } from "../../../Domain/entities/Via";
import { ModalidadeEscalada } from "../../../Domain/enum/EModalidadeEscalada";

/**
 * DTO otimizado para listagens de vias.
 * 
 * Princípios aplicados:
 * - Performance: Carrega apenas dados essenciais para exibição em lista
 * - YAGNI: Não inclui dados nested complexos desnecessários em listagens
 * - Robustez: Trata gracefully entidades parcialmente carregadas
 * 
 * Diferenças vs ViaDetailDTO:
 * - Sem localizações nested (economia de ~40 objetos por via)
 * - Sem fonte, croquis, via_principal
 * - Estrutura simplificada de montanha/face/setor
 */
export class ViaListDTO {
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
    tipo_rocha?: string;
    tipo_escalada?: string;
    modalidade?: ModalidadeEscalada;
    latitude?: number;
    longitude?: number;

    // Relações simplificadas (apenas info básica)
    imagem?: ImagemDTO;
    montanha?: {
        id: number;
        nome: string;
        altura?: number;
    };
    face?: {
        id: number;
        nome: string;
        fantasia?: string;
    };
    setor?: {
        id: number;
        nome: string;
    };

    // Nome da localização principal para exibição rápida
    // Ex: "Rio de Janeiro, RJ" ou "São Paulo, SP"
    localizacaoNome?: string;

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
        this.tipo_rocha = entity.tipo_rocha;
        this.tipo_escalada = entity.tipo_escalada;
        this.modalidade = entity.modalidade;
        this.latitude = entity.latitude ? Number(entity.latitude) : undefined;
        this.longitude = entity.longitude ? Number(entity.longitude) : undefined;

        // Montanha (dados básicos)
        if (entity.montanha && typeof entity.montanha === 'object') {
            const montanha = entity.montanha as any;
            this.montanha = {
                id: montanha.id,
                nome: montanha.nome,
                altura: montanha.altura
            };
        }

        // Face (dados básicos)
        if (entity.face && typeof entity.face === 'object') {
            const face = entity.face as any;
            this.face = {
                id: face.id,
                nome: face.nome,
                fantasia: face.fantasia
            };
        }

        // Setor (dados básicos)
        if (entity.setor && typeof entity.setor === 'object') {
            const setor = entity.setor as any;
            this.setor = {
                id: setor.id,
                nome: setor.nome
            };
        }

        // Imagem com fallback para default
        const viaImagem = entity.imagem && typeof entity.imagem === 'object' && (entity.imagem as any).url 
            ? entity.imagem 
            : null;

        if (viaImagem) {
            this.imagem = new ImagemDTO(viaImagem as any);
        } else {
            // Imagem default para via
            const imagemDefault = {
                id: 4,
                url: "/assets/via-default-01.webp",
                descricao: "Foto Default para Via",
                tipo_entidade: "via"
            };
            this.imagem = new ImagemDTO(imagemDefault as any);
        }

        // TODO: Se necessário no futuro, extrair nome da localização
        // Por enquanto deixar undefined (frontend pode fazer join de montanha.nome, etc.)
        this.localizacaoNome = undefined;
    }
}
