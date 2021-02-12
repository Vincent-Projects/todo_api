const CodeDAL = require('./codeDAL');
const { statusCodes } = require('../constants');

class CodeService {
    static async checkCode(code) {
        if (!code) {
            const error = new Error('InvalidSignupCode');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return error;
        }

        let c;

        try {
            c = await CodeDAL.getByCode(code);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.SERVER_ERROR;
            }
            return err;
        }

        if (!c) {
            const error = new Error('InvalidSignupCode');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return error;
        }

        if (!c.code || c.code !== code) {
            const error = new Error('InvalidSignupCode');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return error;
        }

        return null;
    }

    static async removeCode(code) {
        if (!code) {
            const error = new Error('InvalidSignupCode');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return error;
        }

        try {
            await CodeDAL.deleteByCode(code);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.SERVER_ERROR;
            }
            return err;
        }

        return null;
    }

    static async generateCode() {
        let code = [];

        for (let i = 0; i < 8; i++) {
            const random = Math.floor(Math.random() * 10);

            code.push(random);
        }

        return code.join();
    }
}

module.exports = CodeService;