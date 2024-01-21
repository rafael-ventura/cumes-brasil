// swagger.js

const swaggerAutogen = require('swagger-autogen')();

const outputFile = '../../swagger_output.json';
const endpointsFiles = ['./backend/WebAPI/Controllers/*.ts'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('ts-node').register();
    require('../../WebAPI/server');
});
