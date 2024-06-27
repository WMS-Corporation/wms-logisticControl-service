const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-doc.json');
const socketClient = require('socket.io-client');

const {connectDB} = require("./src/config/dbConnection");
const router = require('./src/routes/route');
const { connectSocket } = require('./src/utils/socketManager');

const logisticControlServicePort = process.env.PORT || 4005;
let corsOptions = {
    origin: new RegExp(`http:\/\/wms-logistic:${logisticControlServicePort}\/.*`),
};
dotenv.config();
const app = express();

const server = http.createServer(app);

const gatewayUrl = process.env.GATEWAY_URL;
connectSocket(gatewayUrl);

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