/**
 * Papéis de autorização do usuário.
 * Fonte de verdade da autorização no backend (coluna `role` em `usuario`).
 * Hierarquia: admin > moderador > usuario.
 */
export enum PapelUsuario {
    Usuario = "usuario",
    Moderador = "moderador",
    Admin = "admin"
}

/** Lista de papéis válidos (útil para validação de entrada). */
export const PAPEIS_USUARIO: PapelUsuario[] = [
    PapelUsuario.Usuario,
    PapelUsuario.Moderador,
    PapelUsuario.Admin
];

export function ehPapelValido(valor: unknown): valor is PapelUsuario {
    return typeof valor === 'string' && (PAPEIS_USUARIO as string[]).includes(valor);
}
