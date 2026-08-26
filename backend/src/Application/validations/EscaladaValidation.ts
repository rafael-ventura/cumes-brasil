import { Participante } from "../../Domain/entities/Participante";
import { ParticipanteTipo } from "../../Domain/enum/EParticipanteTipo";
import ValidationBase from "./ValidationBase";
import BadRequestError from "../errors/BadRequestError";

const PARTICIPANTE_INVALIDO_MESSAGE_ERROR = "Valor de participante inválido";
const COMO_INVALIDO_MESSAGE_ERROR = 'Parâmetro "como" deve ser autor ou marcado (participante é legado, mesmo efeito).';
const COMO_VIAID_CONFLITO_MESSAGE_ERROR = 'Não use viaId junto com como=marcado.';

export default {
    valida(escalada: any): void {
        if (!escalada.participantes) {
            throw new BadRequestError(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
        }
        if (!checaParticipantesTemTipo(escalada.participantes)) {
            throw new BadRequestError(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
        }
        if (!validaParticipantes(escalada.participantes)) {
            throw new BadRequestError(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
        }
    },

    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    queryInt(raw: unknown, name: string, required = false) {
        if (!required && (raw === undefined || raw === null)) return undefined;
        return ValidationBase.numberParam(raw, name);
    },

    queryComoPerfil(raw: unknown): 'autor' | 'marcado' | 'participante' {
        const comoRaw = typeof raw === 'string' ? raw.trim().toLowerCase() : 'autor';
        if (comoRaw !== 'autor' && comoRaw !== 'marcado' && comoRaw !== 'participante') {
            throw new BadRequestError(COMO_INVALIDO_MESSAGE_ERROR);
        }
        return comoRaw as any;
    },

    validaConflitosQuery(como: 'autor' | 'marcado' | 'participante', viaId: number | undefined) {
        const comoMarcado = como === 'marcado' || como === 'participante';
        if (comoMarcado && viaId !== undefined) {
            throw new BadRequestError(COMO_VIAID_CONFLITO_MESSAGE_ERROR);
        }
    }
}

const validaParticipantes = (participantes: Participante[]): boolean => {
    let tiposValidos = participantes.filter((participante: Participante) => {
        return participante.tipo === null || participante.tipo === undefined || checaParticipanteTipoEnumValido(participante.tipo);
    });

    return tiposValidos.length === participantes.length;
}

const checaParticipanteTipoEnumValido = (tipo: string): boolean => {
    return Object.values(ParticipanteTipo).some(enumValue => enumValue === tipo.toUpperCase());
}

const checaParticipantesTemTipo = (participantes: Participante[]): boolean => {
    return participantes.every(participante => participante.tipo);
}
