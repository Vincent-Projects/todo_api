const { validationResult } = require('express-validator');

const statusCodes = require('../constants').statusCodes;
const JWT_EXPIRE = 86400;

// -- Change on import ( branch : best-practice )
const UserService = require('../users').UserService;



exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Something Wrong with data check',
            data: {
                errors: errors.errors
            }
        });
    }

    const { email, password } = req.body;

    const { err, user, token } = await UserService.login(email, password);

    if (err)
        return next(err);

    res.status(statusCodes.OK).json({
        message: 'Successful Login',
        data: {
            username: user.username,
            email: user.email,
            token: token,
            token_expire: 87400
        }
    });
};

exports.postSignup = async (req, res, next) => {
    return res.status(statusCodes.UNAUTHORIZED).json({
        err: "Signup Disabled DM the developer"
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Something wrong with data check',
            data: {
                errors: errors.errors
            }
        });
    }

    const {
        username,
        email,
        password,
        confirmPassword
    } = req.body;

    const { err } = await UserService.signup(username, email, password, confirmPassword);

    if (err)
        return next(err);

    res.status(statusCodes.CREATED).json({
        message: 'User successfully created',
        data: {
            verification_token_expire: JWT_EXPIRE,
        }
    });
};

exports.getVerifyToken = async (req, res, next) => {
    const { token } = req.params;

    const { err, email } = await UserService.verifyAccount(token);

    if (err)
        return next(err);

    res.status(statusCodes.OK).json({
        message: 'Successfully validated the account',
        data: {
            email: email
        }
    });
};

exports.postResetPasswordSendLink = async (req, res, next) => {
    let { email } = req.body;

    const { err } = await UserService.resetPassword(email);

    if (err)
        return next(err);

    res.status(statusCodes.OK).json({
        message: 'Successfully sent mail to reset password'
    });
};

exports.postResetPasswordVerifyToken = async (req, res, next) => {
    const { token } = req.params;
    const {
        password,
        confirmPassword
    } = req.body;

    const { err, email } = await UserService.verifyResetPassword(token, password, confirmPassword);

    if (err)
        return next(err);

    res.status(statusCodes.OK).json({
        message: 'Password successfully updated',
        data: {
            email: email
        }
    });
};