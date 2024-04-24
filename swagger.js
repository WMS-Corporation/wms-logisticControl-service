const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'User API',
        description: 'This API provides endpoints for managing user data.'
    },
    host: 'localhost:4005'
};

const outputFile = './swagger-doc.json';
const routes = ['./src/routes/*.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);