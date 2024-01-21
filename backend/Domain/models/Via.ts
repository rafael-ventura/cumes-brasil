// models/Via.ts

export class Via {
    id: number;
    nome: string;
    grau: string | undefined;
    crux: string | undefined;
    artificial: string | undefined;
    duracao: string | undefined;
    exposicao: string | undefined;
    extensao: number | undefined;
    conquistadores: string[] | undefined;
    detalhes: string | undefined;
    data: Date | undefined;
    montanhaId: number;
    faceId: number;
    viaPrincipalId: number | undefined;
    fonteId: number;

    constructor(id: number, nome: string, grau: string | undefined, crux: string | undefined,
                artificial: string | undefined, duracao: string | undefined, exposicao: string | undefined,
                extensao: number | undefined, conquistadores: string[] | undefined, detalhes: string | undefined,
                data: Date | undefined, montanhaId: number, faceId: number,
                viaPrincipalId: number | undefined, fonteId: number) {
        this.id = id;
        this.nome = nome;
        this.grau = grau;
        this.crux = crux;
        this.artificial = artificial;
        this.duracao = duracao;
        this.exposicao = exposicao;
        this.extensao = extensao;
        this.conquistadores = conquistadores;
        this.detalhes = detalhes;
        this.data = data;
        this.montanhaId = montanhaId;
        this.faceId = faceId;
        this.viaPrincipalId = viaPrincipalId;
        this.fonteId = fonteId;
    }


    public associarMontanha(montanhaId: number): void {
        this.montanhaId = montanhaId;
    }

    public associarFace(faceId: number): void {
        this.faceId = faceId;
    }

    public associarViaPrincipal(viaPrincipalId: number): void {
        this.viaPrincipalId = viaPrincipalId;
    }

    public associarFonte(fonteId: number): void {
        this.fonteId = fonteId;
    }


}
