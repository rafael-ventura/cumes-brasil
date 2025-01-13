"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EParticipanteTipo_1 = require("../../Domain/enum/EParticipanteTipo");
const PARTICIPANTE_INVALIDO_MESSAGE_ERROR = "Valor de participante inválido";
exports.default = {
    valida(escalada) {
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
};
const validaParticipantes = (participantes) => {
    let tiposValidos = participantes.filter((participante) => {
        return participante.tipo === null || participante.tipo === undefined || checaParticipanteTipoEnumValido(participante.tipo);
    });
    return tiposValidos.length === participantes.length;
};
const checaParticipanteTipoEnumValido = (tipo) => {
    return Object.values(EParticipanteTipo_1.ParticipanteTipo).some(enumValue => enumValue === tipo.toUpperCase());
};
const checaParticipantesTemTipo = (participantes) => {
    return participantes.every(participante => participante.tipo);
};
