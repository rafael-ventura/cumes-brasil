export interface Participante {
    id?: number;
    tipo: 'GUIA' | 'PARTICIPANTE' | 'MISTO' | '';
    nome: string;
    email?: string;
    username?: string;
}
