import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 5 },  // subindo gradualmente para 10 usuários
        { duration: '10s', target: 5 },  // sustentando 10 usuários
        { duration: '10s', target: 0 },   // reduzindo para 0 usuários
    ],
};

const BASE_URL = 'http://localhost:4000'; // Substitua com a URL do seu serviço
const VIA_ID = '1'; // Substitua com um ID válido para testes

export default function () {
    // Testando GET /:id
    let res = http.get(`${BASE_URL}/api/vias/${VIA_ID}`);
    check(res, { 'GET /via/:id status was 200': (r) => r.status === 200 });
    sleep(1);

    /*// Testando POST /
    const newViaData = JSON.stringify({
        nome: 'Nova Via',
        grau: '5',
        montanha: 'Montanha X',
        // outros campos conforme necessário
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    res = http.post(`${BASE_URL}/api/via/`, newViaData, params);
    check(res, { 'POST /via/ status was 200': (r) => r.status === 200 });
    sleep(1);

    // Testando PUT /
    const updatedViaData = JSON.stringify({
        id: VIA_ID,
        nome: 'Via Atualizada',
        grau: '6',
        // outros campos conforme necessário
    });
    res = http.put(`${BASE_URL}/api/via/`, updatedViaData, params);
    check(res, { 'PUT /via/ status was 200': (r) => r.status === 200 });
    sleep(1);

    // Testando DELETE /:id
    res = http.del(`${BASE_URL}/via/${VIA_ID}`);
    check(res, { 'DELETE /via/:id status was 200': (r) => r.status === 200 });
    sleep(1);*/
}