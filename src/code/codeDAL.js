const Code = require('./code');

class CodeDAL {
    static async getByCode(code) {
        let c;

        try {
            c = await Code.findOne({ code: code });
        } catch (err) {
            return err;
        }

        if (!c) {
            return new Error('InvalidSignupCode');
        }

        return c;
    }

    static async deleteByCode(code) {
        try {
            await Code.deleteOne({ code })
        } catch (err) {
            return err;
        }

        return null;
    }
}

module.exports = CodeDAL;