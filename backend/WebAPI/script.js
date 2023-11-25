import http from 'k6/http';
import { check, sleep, group } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 }
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% das requisições devem completar abaixo de 500ms
    }
};


const BASE_URL = 'https://dd15-200-95-174-74.ngrok-free.app';

const VIA_ID = '1';

export default function () {
    group('GET All Vias', function () {
        let res = http.get(`${BASE_URL}/api/vias`);
        check(res, { 'status was 200': (r) => r.status === 200 });
    });

    group('Update Via', function () {
        const updatedViaData = JSON.stringify({
            id: VIA_ID,
            nome: 'Via Atualizada',
            grau: '6a',
            
        });
        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let res = http.put(`${BASE_URL}/api/vias/${VIA_ID}`, updatedViaData, params);
        check(res, { 'status was 200': (r) => r.status === 200 });
    });

    sleep(1);
}
