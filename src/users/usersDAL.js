const User = require('./user');

class UsersDAL {

    static getByEmail(email) {
        if (!email) {
            return false;
        }

        return User.findOne({ email: email });
    }

    static saveUser(username, email, password, verification_token, verification_token_expire) {
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

        return User.findOne({ verification_token: token });
    }

    static validateVerifyToken(user) {
        if (!user) {
            return false;
        }

        user.verification_token = null;
        user.verification_token_expire = null;

        return user.save();
    }
}

module.exports = UsersDAL;