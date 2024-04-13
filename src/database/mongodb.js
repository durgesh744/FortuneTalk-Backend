const mongoose = require("mongoose");
const colors = require('colors');
colors.enable();

const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;

module.exports = async () => {
    try {
        const conn = await mongoose.connect(
            MONGO_URI, //connection string
        );
        console.log(`Database Connected (${conn.connection.name}): ${conn.connection.host}`.red);
        if (process.env.NODE_ENV !== "production") {
            console.log(`If you are running server on localhost Change then mongodb database url --> config/db.js`, "\n"
            );
        }

        return conn.connection.db;
    } catch (err) {
        console.log(`Error: ${err.message}`);
        console.log(`Database not Connected`);
    }
};
