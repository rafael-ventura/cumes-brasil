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
            "id": 1,
            "nome": "29 de dezembro",
            "grau": "2.0",
            "crux": "IIsup",
            "artificial": "A2+(2)",
            "duracao": "D3",
            "exposicao": "E3",
            "extensao": 55,
            "conquistadores": ["Jofre Telles", "Marina Mello"],
            "data": "2005-08-05",
            "montanha": {
                "id": 1,
                "nome": "Pão de Açúcar",
                "localizacao": "Rio de Janeiro",
                "altura": 396
            },
            "face": {
                "id": 1,
                "nome": "Face Norte"
            },
            "fonte": {
                "id": 1,
                "referencia": "Guia de Escaladas do Rio de Janeiro"
            },
            "croquis": [
                {
                    "id": 1,
                    "imagemUrl": "http://exemplo.com/croqui1.jpg",
                    "autor": "Fotógrafo de Escaladas",
                    "descricao": "Croqui da via 29 de dezembro, mostrando as principais rochas e caminhos."
                },
                {
                    "id": 2,
                    "imagemUrl": "http://exemplo.com/croqui2.jpg",
                    "autor": "Marcos Carrasqueira",
                    "descricao": "Croqui do crux da Via 29 de dezembro, detalhando os tipos de agarra e trechos artificiais."
                }
            ],
            "id_via_principal": null
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
