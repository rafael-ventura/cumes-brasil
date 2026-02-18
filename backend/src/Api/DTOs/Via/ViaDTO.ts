import { ImagemDTO } from "../Imagem/ImagemDTO";
import { FonteDTO } from "../Fonte/FonteDTO";
import { LocalizacaoDTO } from "../Localizacao/LocalizacaoDTO";
import { Via } from "../../../Domain/entities/Via";
import { ModalidadeEscalada } from "../../../Domain/enum/EModalidadeEscalada";

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
    historia_resumo?: string;
    via_cerj?: boolean;
    equipamentos?: string;
    tracklog_aproximacao?: string;
    data?: string;
    tipo_rocha?: string;
    tipo_escalada?: string;
    modalidade?: ModalidadeEscalada;

    // Relações como objetos completos (informações essenciais)
    imagem?: ImagemDTO; // Primeira imagem (backward compat)
    imagens?: ImagemDTO[]; // Todas as imagens da via
    localizacao?: LocalizacaoDTO; // Localização obtida através de setor/face/montanha (prioridade: setor > face > montanha)
    montanha?: {
        id: number;
        nome: string;
        altura?: number;
        latitude?: number;
        longitude?: number;
        localizacoes?: LocalizacaoDTO[];
    };
    face?: {
        id: number;
        nome: string;
        fantasia?: string;
        latitude?: number;
        longitude?: number;
        montanha?: {
            id: number;
            nome: string;
            altura?: number;
            latitude?: number;
            longitude?: number;
            localizacoes?: LocalizacaoDTO[];
        };
        localizacoes?: LocalizacaoDTO[];
    };
    setor?: {
        id: number;
        nome: string;
        latitude?: number;
        longitude?: number;
        face?: {
            id: number;
            nome: string;
            fantasia?: string;
            latitude?: number;
            longitude?: number;
            montanha?: {
                id: number;
                nome: string;
                altura?: number;
                latitude?: number;
                longitude?: number;
                localizacoes?: LocalizacaoDTO[];
            };
            localizacoes?: LocalizacaoDTO[];
        };
        montanha?: {
            id: number;
            nome: string;
            altura?: number;
            latitude?: number;
            longitude?: number;
            localizacoes?: LocalizacaoDTO[];
        };
        localizacoes?: LocalizacaoDTO[];
    };
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
        this.historia_resumo = entity.historia_resumo;
        this.via_cerj = entity.via_cerj;
        this.equipamentos = entity.equipamentos;
        this.tracklog_aproximacao = entity.tracklog_aproximacao;
        this.data = entity.data;
        this.tipo_rocha = entity.tipo_rocha;
        this.tipo_escalada = entity.tipo_escalada;
        this.modalidade = entity.modalidade;
        
        // Coordenadas geográficas
        this.latitude = entity.latitude ? Number(entity.latitude) : undefined;
        this.longitude = entity.longitude ? Number(entity.longitude) : undefined;

        // Montanha (se via está diretamente na montanha)
        if (entity.montanha && typeof entity.montanha === 'object') {
            const montanha = entity.montanha as any;
            this.montanha = {
                id: montanha.id,
                nome: montanha.nome,
                altura: montanha.altura,
                latitude: montanha.latitude ? Number(montanha.latitude) : undefined,
                longitude: montanha.longitude ? Number(montanha.longitude) : undefined,
                localizacoes: montanha.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
            };
            // Usar primeira localização da montanha como localização principal
            if (montanha.localizacoes && montanha.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(montanha.localizacoes[0]);
            }
        }

        // Face (se via está diretamente na face)
        if (entity.face && typeof entity.face === 'object') {
            const face = entity.face as any;
            this.face = {
                id: face.id,
                nome: face.nome,
                fantasia: face.fantasia,
                latitude: face.latitude ? Number(face.latitude) : undefined,
                longitude: face.longitude ? Number(face.longitude) : undefined,
                localizacoes: face.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
            };

            // Montanha da Face
            if (face.montanha && typeof face.montanha === 'object') {
                const montanha = face.montanha;
                this.face.montanha = {
                    id: montanha.id,
                    nome: montanha.nome,
                    altura: montanha.altura,
                    latitude: montanha.latitude ? Number(montanha.latitude) : undefined,
                    longitude: montanha.longitude ? Number(montanha.longitude) : undefined,
                    localizacoes: montanha.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
                };
            }
            // Usar primeira localização da face como localização principal (prioridade sobre montanha)
            if (face.localizacoes && face.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(face.localizacoes[0]);
            }
        }

        // Setor (prioridade máxima - se via está em setor)
        if (entity.setor && typeof entity.setor === 'object') {
            const setor = entity.setor as any;
            this.setor = {
                id: setor.id,
                nome: setor.nome,
                latitude: setor.latitude ? Number(setor.latitude) : undefined,
                longitude: setor.longitude ? Number(setor.longitude) : undefined,
                localizacoes: setor.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
            };

            // Face do Setor (se existir)
            if (setor.face && typeof setor.face === 'object') {
                const face = setor.face;
                this.setor.face = {
                    id: face.id,
                    nome: face.nome,
                    fantasia: face.fantasia,
                    latitude: face.latitude ? Number(face.latitude) : undefined,
                    longitude: face.longitude ? Number(face.longitude) : undefined,
                    localizacoes: face.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
                };

                // Montanha da Face
                if (face.montanha && typeof face.montanha === 'object') {
                    const montanha = face.montanha;
                    this.setor.face.montanha = {
                        id: montanha.id,
                        nome: montanha.nome,
                        altura: montanha.altura,
                        latitude: montanha.latitude ? Number(montanha.latitude) : undefined,
                        longitude: montanha.longitude ? Number(montanha.longitude) : undefined,
                        localizacoes: montanha.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
                    };
                }
            }

            // Montanha direta do Setor (se não tiver face)
            if (setor.montanha && typeof setor.montanha === 'object' && !this.setor.face) {
                const montanha = setor.montanha;
                this.setor.montanha = {
                    id: montanha.id,
                    nome: montanha.nome,
                    altura: montanha.altura,
                    latitude: montanha.latitude ? Number(montanha.latitude) : undefined,
                    longitude: montanha.longitude ? Number(montanha.longitude) : undefined,
                    localizacoes: montanha.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
                };
            }
            // Usar primeira localização do setor como localização principal (prioridade máxima)
            // Se o setor não tiver localizações, fazer fallback para face ou montanha
            if (setor.localizacoes && setor.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(setor.localizacoes[0]);
            } else if (setor.face && typeof setor.face === 'object' && setor.face.localizacoes && setor.face.localizacoes.length > 0) {
                // Fallback: usar localização da face do setor
                this.localizacao = new LocalizacaoDTO(setor.face.localizacoes[0]);
            } else if (setor.montanha && typeof setor.montanha === 'object' && setor.montanha.localizacoes && setor.montanha.localizacoes.length > 0) {
                // Fallback: usar localização da montanha do setor
                this.localizacao = new LocalizacaoDTO(setor.montanha.localizacoes[0]);
            }
        }

        // Imagens da via (via viaImagens)
        const viaImagens = entity.viaImagens && Array.isArray(entity.viaImagens)
            ? [...entity.viaImagens]
            : [];
        const imagensObjetos = viaImagens
            .map((vi: any) => vi.imagem)
            .filter((img: any) => img && typeof img === 'object' && img.url);

        this.imagens = imagensObjetos.map((img: any) => new ImagemDTO(img));
        this.imagem = this.imagens.length > 0 ? this.imagens[0] : new ImagemDTO({
            id: 4,
            url: "/assets/via-default-01.webp",
            descricao: "Foto Default para Via",
            tipo_entidade: "via"
        } as any);

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
