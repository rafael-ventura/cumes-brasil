const fs = require('fs');
const Papa = require('papaparse');
const { DocumentStore } = require('ravendb');


main();


async function main() {
    const mappedDocs = await mapToDocumentModel();
    await saveToRavenDB(mappedDocs);
}


// Mapear para o Modelo de Documento
async function mapToDocumentModel() {
    const usuarios = await readCSV('/mnt/data/usuarios.csv');
    const colecoes = await readCSV('/mnt/data/colecoes.csv');
    const vias = await readCSV('/mnt/data/vias.csv');
    const montanhas = await readCSV('/mnt/data/montanhas.csv');
    const faces = await readCSV('/mnt/data/faces.csv');
    const croquis = await readCSV('/mnt/data/croqui.csv');
    const fontes = await readCSV('/mnt/data/fontes.csv');
    const viasCroquis = await readCSV('/mnt/data/vias_croquis.csv');
    const viasColecoes = await readCSV('/mnt/data/vias_colecoes.csv');

    const usuarioDocs = usuarios.map(usuario => ({
        id: `usuario/U-${usuario.id}`,
        nome: usuario.nome,
        email: usuario.email,
        colecoes: colecoes
            .filter(c => c.usuario_id === usuario.id)
            .map(colecao => ({
                nome: colecao.nome,
                tipo_colecao: colecao.tipo_colecao,
                vias: viasColecoes
                    .filter(vc => vc.colecao_id === colecao.id)
                    .map(vc => `vias/V-${vc.via_id}`)
            }))
    }));

    const viaDocs = vias.map(via => ({
        id: `via/V-${via.id}`,
        nome: via.nome,
        grau: via.grau,
        crux: via.crux,
        artificial: via.artificial,
        duracao: via.duracao,
        exposicao: via.exposicao,
        conquistadores: via.conquistadores,
        detalhes: via.detalhes,
        fonte: fontes.find(f => f.id === via.id_fonte).referencia,
        variante: vias.filter(v => v.variante === via.id).map(v => ({
            id: `variante/VA-${v.id}`,
            fk_variante: `via/V-${v.id}`
        })),
        montanha: montanhas.find(m => m.id === via.id_montanha),
        face: faces.find(f => f.id === via.id_face),
        data: via.data,
        croqui: viasCroquis
            .filter(vc => vc.id_via === via.id)
            .map(vc => croquis.find(c => c.id === vc.id_croqui))
    }));

    return {
        usuarios: usuarioDocs,
        vias: viaDocs
    };
}

function readCSV(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf8');
    return new Promise((resolve) => {
        Papa.parse(csvData, {
            header: true,
            complete: (result) => {
                resolve(result.data);
            }
        });
    });
}

async function saveToRavenDB(data) {
    const store = new DocumentStore('http://localhost:4021', 'cumes_brasil');
    store.initialize();

    const session = store.openSession();

    for (const usuario of data.usuarios) {
        await session.store(usuario);
    }

    for (const via of data.vias) {
        await session.store(via);
    }

    await session.saveChanges();
}


