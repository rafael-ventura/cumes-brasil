import { Participante } from "../../Domain/entities/Participante";
import { ParticipanteTipo } from "../../Domain/enum/EParticipanteTipo";
import ValidationBase from "./ValidationBase";
import BadRequestError from "../errors/BadRequestError";

const PARTICIPANTE_INVALIDO_MESSAGE_ERROR = "Valor de participante inválido";

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
