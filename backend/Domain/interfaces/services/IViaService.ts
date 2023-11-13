

export interface IViaService {
    getAllVias(): Promise<any>;
    getViaById(id: number): Promise<any>;
    getViaByNome(nome: string): Promise<any>;
    getViaDetailedById(id: number): Promise<any>;
    createVia(nome: string, grau: string, localizacao: string, altura: number, descricao: string, faceId: number): Promise<any>;
    updateVia(id: number, nome: string, grau: string, localizacao: string, altura: number, descricao: string, faceId: number): Promise<any>;
    deleteVia(id: number): Promise<any>;
}