const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_ROUND = parseInt(process.env.BCRYPT_ROUND);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = 86400;

const UsersDAL = require('./usersDAL');
const { statusCodes } = require('../constants');


class UserService {
    static async login(email, password) {
        let user;

        try {
            user = await UsersDAL.getByEmail(email.toLowerCase());
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!user) {
            const error = new Error('No user registered with this email');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (user.verify_account_token || user.verify_account_expire) {
            const error = new Error('You need to verify your account');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let hash;

        try {

            hash = await bcrypt.compare(password, user.password);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!hash) {
            const error = new Error('Wrong Credentials');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        return { token: token, user: user };
    }
}

module.exports = UserService;