export interface CroquiDocument {
    '@metadata': {
        '@collection': 'Croquis'
    };
    Id: number;
    CaminhoImagem: string;
    Autor: string;
    Descricao?: string;
}
