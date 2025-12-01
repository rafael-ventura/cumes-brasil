import { Localizacao } from '../../../Domain/entities/Localizacao';

export class LocalizacaoDTO {
    id: number;
    continente?: { id: number; nome: string };
    pais?: { id: number; nome: string };
    regiao?: { id: number; nome: string } | null;
    estado?: { id: number; nome: string; sigla: string };
    cidade?: { id: number; nome: string };
    bairro?: { id: number; nome: string } | null;

    constructor(entity: Localizacao) {
        this.id = entity.id;

        if (entity.continente && typeof entity.continente === 'object') {
            this.continente = {
                id: entity.continente.id,
                nome: entity.continente.nome
            };
        }

        if (entity.pais && typeof entity.pais === 'object') {
            this.pais = {
                id: entity.pais.id,
                nome: entity.pais.nome
            };
        }

        if (entity.regiao && typeof entity.regiao === 'object') {
            this.regiao = {
                id: entity.regiao.id,
                nome: entity.regiao.nome
            };
        } else {
            this.regiao = null;
        }

        if (entity.estado && typeof entity.estado === 'object') {
            this.estado = {
                id: entity.estado.id,
                nome: entity.estado.nome,
                sigla: entity.estado.sigla
            };
        }

        if (entity.cidade && typeof entity.cidade === 'object') {
            this.cidade = {
                id: entity.cidade.id,
                nome: entity.cidade.nome
            };
        }

        if (entity.bairro && typeof entity.bairro === 'object') {
            this.bairro = {
                id: entity.bairro.id,
                nome: entity.bairro.nome
            };
        } else {
            this.bairro = null;
        }
    }
}

