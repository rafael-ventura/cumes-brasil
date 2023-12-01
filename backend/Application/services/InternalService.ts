import {MontanhaRepository} from "../../Infrastructure/repositories/MontanhaRepository";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";
import {FaceRepository} from "../../Infrastructure/repositories/FaceRepository";
import {FonteRepository} from "../../Infrastructure/repositories/FonteRepository";

const fs = require('fs');
const fastcsv = require('fast-csv');


export class InternalService {

    private montanhaRepository: MontanhaRepository;
    private viaRepository: ViaRepository;
    private faceRepository: FaceRepository;
    private fonteRepository: FonteRepository;
    private croquiRepository: CroquiRepository;

    constructor(montanhaRepository: MontanhaRepository, viaRepository: ViaRepository, faceRepository: FaceRepository, fonteRepository: FonteRepository, croquiRepository: CroquiRepository) {
        this.montanhaRepository = montanhaRepository;
        this.viaRepository = viaRepository;
        this.faceRepository = faceRepository;
        this.fonteRepository = fonteRepository;
        this.croquiRepository = croquiRepository;
    }


    readCSV(filePath: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const records: any[] = [];
            fs.createReadStream(filePath)
                .pipe(fastcsv.parse({headers: true, skipEmptyLines: true}))
                .on('data', (row: any) => records.push(row))
                .on('end', () => resolve(records))
                .on('error', (error: any) => reject(error));
        });
    }


    transformToViaDocument(vias: any[]) {
        return vias.map(via => ({
            '@metadata': {'@collection': 'Vias'},
            Id: (via.id),
            Nome: via.nome,
            Croquis: via.croquis,
            Montanha: via.id_montanha,
            Grau: via.grau,
            Crux: via.crux,
            Artificial: via.artificial,
            Duracao: via.duracao,
            Exposicao: via.exposicao,
            Extensao: via.extensao,
            Conquistadores: via.conquistadores,
            Detalhes: via.detalhes,
            Data: via.data,
            IdFace: via.id_face,
            IdFonte: via.id_fonte,
            IdViaPrincipal: via.id_viaPrincipal,
        }));
    }

    transformToMontanhaDocument(montanhas: any[]) {
        return montanhas.map(montanha => ({
            '@metadata': {'@collection': 'Montanhas'},
            Id: parseInt(montanha.id),
            Nome: montanha.nome,
            Localizacao: montanha.localizacao,
            Altura: montanha.altura,
            Vias: montanha.vias,
        }));

    }

    transformToFaceDocument(faces: any[]) {
        return faces.map(face => ({
            '@metadata': {'@collection': 'Faces'},
            Id: parseInt(face.id),
            Nome: face.nome,
            Vias: face.vias,
        }));
    }

    transformToFonteDocument(fontes: any[]) {
        return fontes.map(fonte => ({
            '@metadata': {'@collection': 'Fontes'},
            Id: parseInt(fonte.id),
            Referencia: fonte.referencia,
        }));
    }

    transformToCroquiDocument(croquis: any[]) {
        return croquis.map(croqui => ({
            '@metadata': {'@collection': 'Croquis'},
            Id: parseInt(croqui.id),
            Referencia: croqui.referencia,
        }));
    }

    async processCSVData() {
        try {
            const montanhas = await this.readCSV('../database/csv/montanhas.csv');
            const fontes = await this.readCSV('../database/csv/fontes.csv');
            const faces = await this.readCSV('../database/csv/faces.csv');
            const vias = await this.readCSV('../database/csv/vias.csv');
            const croquis = await this.readCSV('../database/csv/croqui.csv');


            const viaDocuments = this.transformToViaDocument(vias);
            const montanhaDocuments = this.transformToMontanhaDocument(montanhas);
            const faceDocuments = this.transformToFaceDocument(faces);
            const fonteDocuments = this.transformToFonteDocument(fontes);
            const croquiDocuments = this.transformToCroquiDocument(croquis);


            for (const viaDoc of viaDocuments) {
                await this.viaRepository.createVia(viaDoc as any);
            }
            for (const montanhaDoc of montanhaDocuments) {
                await this.montanhaRepository.createMontanha(montanhaDoc as any);
            }
            for (const faceDoc of faceDocuments) {
                await this.faceRepository.createFace(faceDoc as any);
            }
            for (const fonteDoc of fonteDocuments) {
                await this.fonteRepository.createFonte(fonteDoc as any);
            }
            for (const croquiDoc of croquiDocuments) {
                await this.croquiRepository.createCroqui(croquiDoc as any);

            }

            console.log("Dados carregados com sucesso no RavenDB!");
        } catch
            (error) {
            console.error("Erro ao processar dados do CSV: ", error);
        }
    }

}