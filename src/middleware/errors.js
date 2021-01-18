const statusCodes = require('../constants');
const fs = require('fs');
const path = require("path");

const LOGS_DIR = path.join(__dirname, "logs");

const errorHandler = async (err) => {
    try {
        await fs.writeFile(path.join(LOGS_DIR, "errors.log"), err, "w", err => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = errorHandler;