// Database connections initialization file
require('./mongodb')();
require('./Redis.database');

const mongoose = require("mongoose");
const deasync = require("deasync");

// Wait for the connection to be established
let connected = false;
mongoose.connection.on('connected', () => {
    connected = true;
});

// Synchronously wait until connected is true
deasync.loopWhile(() => !connected);
