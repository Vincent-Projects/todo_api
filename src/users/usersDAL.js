const User = require('./user');

class UsersDAL {

    static getByEmail(email) {
        if (!email) {
            return false;
        }

        return User.findOne({ email: email });
    }

    static saveUser({ username, email, password, verification_token, verification_token_expire }) {
        if (!username || !email || !password || !verification_token || !verification_token_expire)
            return false;

        const user = new User({
            username,
            email,
            password,
            verify_account_token: verification_token,
            verify_account_expire: verification_token_expire
        });

        return user.save();
    }

    static getByVerificationToken(token) {
        if (!token) {
            return false;
        }

        return User.findOne({ verify_account_token: token });
    }

    static getByResetToken(token) {
        if (!token)
            return false;

        return User.findOne({ reset_password_token: token });
    }

    static validateVerifyToken(user) {
        if (!user) {
            return false;
        }

        user.verify_account_token = null;
        user.verify_account_expire = null;

        return user.save();
    }
}

module.exports = UsersDAL;