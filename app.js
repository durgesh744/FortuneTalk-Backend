const express = require("express");
const cluster = require('cluster');

// <------------------------------------------------ initialize app --------------------------------------------------->
const app = express();

// <--------------------------------------------- Sentry setup -------------------------------------------------------->
const sentry = require("./src/config/sentry");
sentry.SentrySetup(app);


// <--------------------------------------------- body parser setup test  rr -------------------------------------------------->

// remove body size limit
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '2gb' }));
app.use(bodyParser.urlencoded({ limit: '2gb', extended: true }));


// <------------------------------------------------ CORS config ------------------------------------------------------>
const cors = require("cors");
app.use(cors());

// <---------------------------------------------- Logging Middleware ------------------------------------------------->

// Define custom Morgan token for cluster worker ID
const morgan = require("morgan");
morgan.token('worker', () => {
    if (cluster.isWorker) {
        return cluster.worker.id;
    }
    return 'N/A';
});

// Use Morgan middleware with the custom token
app.use(morgan('\x1b[36m:worker\x1b[0m \x1b[34m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[32m:status\x1b[0m :response-time ms'));


// <---------------------------------------------- main route setup --------------------------------------------------->
// v1 api routes
app.use('/api/v1', require('./src/routes/v1'));
app.get("/", (req, res) => res.status(200).send("Hello world"))


// <------------------------------------------------ error handler ---------------------------------------------------->
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

sentry.SentryErrorHandler(app);

module.exports = {
    app,
}