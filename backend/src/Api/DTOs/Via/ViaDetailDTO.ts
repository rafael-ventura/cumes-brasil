import { ImagemDTO } from "../Imagem/ImagemDTO";
import { FonteDTO } from "../Fonte/FonteDTO";
import { LocalizacaoDTO } from "../Localizacao/LocalizacaoDTO";
import { Via } from "../../../Domain/entities/Via";
import { ViaListDTO } from "./ViaListDTO";

/**
 * DTO completo para visualização detalhada de via.
 * 
 * Extends ViaListDTO e adiciona:
 * - Localizações nested completas (setor/face/montanha com suas localizações)
 * - Fonte
 * - Via principal
 * - Arrays de IDs de relações (variantes, croquis, coleções, escaladas)
 * 
 * Princípios aplicados:
 * - DRY: Herda campos básicos de ViaListDTO, evita duplicação
 * - SRP: Responsável por serializar via completa para visualização detalhada
 * - Backward Compatible: Mantém exatamente a mesma estrutura do ViaDTO original
 * 
 * Uso:
 * - GET /vias/:id (página de detalhes)
 * - POST /vias (response após criar)
 * - PUT /vias/:id (response após atualizar)
 */
export class ViaDetailDTO extends ViaListDTO {
    // Campos adicionais que ViaListDTO não tem
    localizacao?: LocalizacaoDTO;
    fonte?: FonteDTO;
    via_principal?: { id: number; nome: string; grau?: string };
    variantesIds?: number[];
    viaCroquisIds?: number[];
    viaColacoesIds?: number[];
    escaladasIds?: number[];

    // Override de campos de ViaListDTO para incluir localizações nested
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

    constructor(entity: Via) {
        super(entity); // Inicializa campos básicos

        // Sobrescrever montanha/face/setor com versões completas (incluindo localizações)
        
        // Montanha completa
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

        // Face completa
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

        // Setor completo (prioridade máxima)
        if (entity.setor && typeof entity.setor === 'object') {
            const setor = entity.setor as any;
            this.setor = {
                id: setor.id,
                nome: setor.nome,
                latitude: setor.latitude ? Number(setor.latitude) : undefined,
                longitude: setor.longitude ? Number(setor.longitude) : undefined,
                localizacoes: setor.localizacoes?.map((loc: any) => new LocalizacaoDTO(loc)) || []
            };

            // Face do Setor
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

                // Montanha da Face do Setor
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

            // Localização principal com fallback
            if (setor.localizacoes && setor.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(setor.localizacoes[0]);
            } else if (setor.face && typeof setor.face === 'object' && setor.face.localizacoes && setor.face.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(setor.face.localizacoes[0]);
            } else if (setor.montanha && typeof setor.montanha === 'object' && setor.montanha.localizacoes && setor.montanha.localizacoes.length > 0) {
                this.localizacao = new LocalizacaoDTO(setor.montanha.localizacoes[0]);
            }
        }

        // Fonte
        this.fonte = entity.fonte && typeof entity.fonte === 'object'
            ? new FonteDTO(entity.fonte as any) 
            : undefined;

        // Via principal simplificada
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
