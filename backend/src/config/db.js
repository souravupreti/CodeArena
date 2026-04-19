const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB: "+error);
    }
}

module.exports = main;


