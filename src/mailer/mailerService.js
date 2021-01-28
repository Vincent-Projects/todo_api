const TRANSPORTER = require("./transporter");
const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const { statusCodes } = require('../constants');

class MailerService {
    static async sendMail(email, subject, message) {
        const mailOptions = {
            from: NODEMAILER_EMAIL,
            to: email.toLowerCase(),
            subject: subject,
            html: message,
        };

        try {
            await TRANSPORTER.sendMail(mailOptions);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        return { err: null };
    }
}

module.exports = MailerService;