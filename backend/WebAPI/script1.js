import http from 'k6/http';
import {check, sleep, group} from 'k6';

export let options = {
    stages: [
        {duration: '30s', target: 10},
        {duration: '1m', target: 10},
        {duration: '30s', target: 20},
        {duration: '1m', target: 20},
        {duration: '30s', target: 0}
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% das requisições devem completar abaixo de 500ms
    }
};


const BASE_URL = 'https://622a-200-95-174-157.ngrok-free.app';

const VIA_ID = '1';

export default function () {
    group('GET All Vias', function () {
        let res = http.get(`${BASE_URL}/api/vias`);
        check(res, {'status was 200': (r) => r.status === 200});
    });

    group('Update Via', function () {
        const updatedViaData = JSON.stringify({
            id: VIA_ID,
            ravenId: "",
            nome: "29 de dezembro Atualizada",
            croquis: [
                {
                    id: 1,
                    ravenId: "",
                    autor: "Fotógrafo de Escaladas Atualizado",
                    imagemUrl: "http://exemplo.com/croqui1_atualizado.jpg",
                    descricao: "Descrição atualizada do Croqui da via 29 de dezembro."
                },
                {
                    id: 2,
                    ravenId: "",
                    autor: "Marcos Carrasqueira Atualizado",
                    imagemUrl: "http://exemplo.com/croqui2_atualizado.jpg",
                    descricao: "Descrição atualizada do Croqui do crux da Via 29 de dezembro."
                }
            ],
            montanha: 1,
            grau: "6a",
            crux: "IIsup Atualizado",
            artificial: "A2+(2) Atualizado",
            duracao: "D3 Atualizado",
            exposicao: "E3 Atualizado",
            extensao: 60,
            conquistadores: ["Jofre Telles Atualizado", "Marina Mello Atualizada"],
            data: "2006-09-05",
            id_face: 2,
            id_fonte: 2
        });
        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let res = http.put(`${BASE_URL}/api/vias`, updatedViaData, params);
        check(res, {'status was 200': (r) => r.status === 200});
    });

    sleep(1);
}
