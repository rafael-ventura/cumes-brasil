import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 5 },  // subindo gradualmente para 10 usuários
        { duration: '5s', target: 5 },  // sustentando 10 usuários
        { duration: '5s', target: 0 },   // reduzindo para 0 usuários
    ],
};

const BASE_URL = 'http://localhost:4000/api/vias'
const VIA_ID_BASE = '3631e917-0ce4-4d6a-b75e-a99ed185edc5';
const VIA_ID = '1';
const VIA_ID_EXCLUDE = '3';
let res;

export default function () {
    // Testando GET /:id
    res = http.get(`${BASE_URL}/${VIA_ID}`);
    check(res, { 'GET /via/:id status was 200': (r) => r.status === 200 });
    sleep(5);

    // Testando GET all/
    res = http.get(`${BASE_URL}`);
    check(res, { 'GET /via/ status was 200': (r) => r.status === 200 });
    sleep(5);

    // Testando DELETE /:id
    res = http.delete(`${BASE_URL}/${VIA_ID_EXCLUDE}`);
    check(res, { 'DELETE /vias/:id status was 200': (r) => r.status === 200 });
    sleep(5);
}