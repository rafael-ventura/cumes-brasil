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
    montanha_id: number;
    face_id: number;
    via_principal_id: number | undefined;
    fonte_id: number;

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
        this.montanha_id = montanhaId;
        this.face_id = faceId;
        this.via_principal_id = viaPrincipalId;
        this.fonte_id = fonteId;
    }


    public associarMontanha(montanhaId: number): void {
        this.montanha_id = montanhaId;
    }

    public associarFace(faceId: number): void {
        this.face_id = faceId;
    }

    public associarViaPrincipal(viaPrincipalId: number): void {
        this.via_principal_id = viaPrincipalId;
    }

    public associarFonte(fonteId: number): void {
        this.fonte_id = fonteId;
    }


}
