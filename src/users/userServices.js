const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_ROUND = parseInt(process.env.BCRYPT_ROUND);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = 86400;
const FRONT_BASE_URL = process.env.FRONT_BASE_URL;

const UsersDAL = require('./usersDAL');
const Mailer = require('../mailer').Mailer;
const MailerService = require('../mailer').MailerService;

const { statusCodes } = require('../constants');


class UserService {
    static async login({ email, password }) {
        if (!email || !password) {
            const error = new Error('No Data Provided');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

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

    static async signup(username, email, password, confirmPassword) {
        if (password !== confirmPassword) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const error = new Error('Password does not match');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let user;

        try {
            user = await UsersDAL.getByEmail(email.toLowerCase());
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (user) {
            const error = new Error('Email already taken');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let hash;

        try {
            hash = await bcrypt.hash(password, BCRYPT_ROUND);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!hash) {
            const error = new Error('Server Error');
            error.UNAUTHORIZED;
            return { err: error };
        }

        const token = jwt.sign({ email: email.toLowerCase() }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        let success;

        try {
            success = await UsersDAL.saveUser({
                username: username,
                email: email.toLowerCase(),
                password: hash,
                verification_token: token,
                verification_token_expire: new Date(Date.now() + JWT_EXPIRE * 1000)
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!success) {
            const error = new Error('Failed to create user');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }


        const title = `Hi, ${username}`;
        const text1 = 'Welcome to TodoList, thanks for signing up, i hope you\'ll enjoy this app. Click the link below to activate your account.';
        const text2 = 'If you have any questions or recommandations for the app, feel free to email me via vincent.crys.dev@gmail.com.';
        const link = {
            text: 'Activate My Account',
            href: `${FRONT_BASE_URL}/auth/confirm/account/${token}`
        };

        const verificationPage = Mailer.getEmailString(title, text1, text2, link);

        const { err } = await MailerService.sendMail(email, 'Account Verification', verificationPage);

        if (err)
            return { err: err };

        return {};
    }

    static async verifyAccount(token) {
        let user;

        try {
            user = await UsersDAL.getByVerificationToken(token);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!user) {
            const error = new Error('There was a problem with this request');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        // Create a token service and obejct to modularize this
        const today = new Date(Date.now());
        const expireDate = new Date(user.verify_account_expire);

        if (today > expireDate) {
            const error = new Error('The validation link has expired');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let success = false;

        try {
            success = await UsersDAL.validateVerifyToken(user);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!success) {
            const error = new Error('There was a probleme verifying this account');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const data = jwt.verify(token, JWT_SECRET); // is this possible to fail ? Then handle it
        //Send an email
        return { email: data.email };
    }

    static async resetPassword(email) {
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
            const error = new Error('There is no user with this email');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        let success = false;
        user.reset_password_token = token;
        user.reset_password_expire = new Date(Date.now() + JWT_EXPIRE * 1000);

        try {
            success = await user.save();
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!success) {
            const error = new Error('Failed to send reset password mail');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const title = 'Reset Password';
        const text1 = 'You request for reset password. Click the link below to reset your password.';
        const text2 = 'If you did not requested for reset password, then don\'t consider this email';
        const link = {
            text: 'Reset My Password',
            href: `${FRONT_BASE_URL}/reset-password/${token}`
        };

        const verificationPage = Mailer.getEmailString(title, text1, text2, link);

        const { err } = await MailerService.sendMail(email, 'Reset Password', verificationPage);

        if (err)
            return { err: err };

        return {};
    }

    static async verifyResetPassword(token, password, confirmPassword) {
        let user;

        try {
            user = await UsersDAL.getByResetToken(token);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!user) {
            const error = new Error('There was a problem with this request');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const today = new Date(Date.now());
        const expireDate = new Date(user.reset_password_expire);

        if (today > expireDate) {
            const error = new Error('The reset link has expired');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (password !== confirmPassword || !password) {
            const error = new Error('Password must match');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let hash;

        try {
            hash = await bcrypt.hash(password, BCRYPT_ROUND);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!hash) {
            const error = new Error('Password problem');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }




        user.reset_password_token = null;
        user.reset_password_expire = null;
        user.password = hash;
        let success = false;
        try {
            success = await user.save();
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!success) {
            const error = new Error('Failed to change password');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        const title = 'Password successfully changed';
        const text1 = 'Your password has successfully been changed.';

        const verificationPage = Mailer.getEmailString(title, text1);

        const { email } = jwt.verify(token, JWT_SECRET);
        const { err } = await MailerService.sendMail(email, 'Password Changed', verificationPage);

        if (err)
            return { err: err };

        return { email: email };
    }
}

module.exports = UserService;