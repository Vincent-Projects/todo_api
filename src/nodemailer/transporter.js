const nodemailer = require("nodemailer");

const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;

module.exports = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT, // 587 if secure is false, 465 if true
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS
    }
});