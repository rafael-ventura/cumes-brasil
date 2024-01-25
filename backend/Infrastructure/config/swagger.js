const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {}
const outputFile = '../../swagger_output.json';
const endpointsFiles = [path.join(__dirname, '../../WebAPI/Controllers/UsuarioController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/CroquiController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/MontanhaController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/FonteController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/FaceController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/ViaController.ts'),
    path.join(__dirname, '../../WebAPI/Controllers/ConexaoController.ts')
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('ts-node').register();
    require('../../WebAPI/server');
});
