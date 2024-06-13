import { Participante } from "../../entities/Participante";
import { ParticipanteTipo } from "../enum/EParticipanteTipo";

const PARTICIPANTE_INVALIDO_MESSAGE_ERROR = "Valor de participante inválido";

export default {
    valida(escalada: any): void {
        if (!escalada.participantes) {
            throw new Error(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
        }
        if (!checaParticipantesTemTipo(escalada.participantes)) {
            throw new Error(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
        }
        if (!validaParticipantes(escalada.participantes)) {
            throw new Error(PARTICIPANTE_INVALIDO_MESSAGE_ERROR);
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