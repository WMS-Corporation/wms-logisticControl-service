const express = require('express');
const cors = require('cors');
const {connectDB} = require("./src/config/dbConnection");
const dotenv = require('dotenv');
const router = require('./src/routes/route')
const http = require('http');
const socketClient = require('socket.io-client');

const logisticControlServicePort = process.env.PORT || 4005;
let corsOptions = {
    origin: new RegExp(`http:\/\/wms-logistic:${logisticControlServicePort}\/.*`),
};
dotenv.config();
const app = express();

const server = http.createServer(app);

const gatewayUrl = process.env.GATEWAY_URL;
const socket = socketClient(gatewayUrl);

socket.on('connect', () => {
    console.log(`Connected to gateway at ${gatewayUrl}`);
});



// Simula il monitoraggio della temperatura e invia alert quando necessario
function monitorTemperature() {
    const zone = 'Zona 1';
    const temperature = Math.floor(Math.random() * 30); // Simula una lettura della temperatura

    if (temperature < 18) { // Soglia di temperatura
        console.log(`Temperature alert for ${zone}: ${temperature}°C`);
        // Invia l'alert al gateway
        socket.emit('temperature-alert', { zone, temperature });
    }
}

setInterval(monitorTemperature, 5000); // Controlla la temperatura ogni 5 secondi



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-doc.json'); // Importa il file di documentazione Swagger JSON
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.disable("x-powered-by");
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

server.listen(logisticControlServicePort, () => {
    console.info(`WMS-logisticControl-service is running`);
    console.log(`Temperature monitoring service running on port ${logisticControlServicePort}`);
});

connectDB(process.env.DB_NAME);

module.exports = { app };