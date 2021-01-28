const jwt = require('jsonwebtoken');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const TRANSPORTER = require("../nodemailer/transporter");
const mailTemplate = require('../nodemailer/template');

const statusCodes = require("../constants").statusCodes;

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;

const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_ROUND = parseInt(process.env.BCRYPT_ROUND);
const JWT_EXPIRE = 86400;

const BASE_URL = process.env.BASE_URL;
const FRONT_BASE_URL = process.env.FRONT_BASE_URL;




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

    const {
        email,
        password
    } = req.body;

    let user;

    try {
        user = await User.findOne({ email: email.toLowerCase() });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "No user registered with this email"
        });
    }

    if (user.verify_account_token || user.verify_account_expire) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "You need to verify you account"
        });
    }

    let hash;

    try {

        hash = await bcrypt.compare(password, user.password);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!hash) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Wrong Password"
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(statusCodes.OK).json({
        message: "Successful Login",
        data: {
            username: user.username,
            email: user.email,
            token: token,
            token_expire: 87400
        }
    });
}

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Something wrong with data check",
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

    if (password !== confirmPassword) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Password must match"
        });
    }

    if (!username || !email || !password) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "All field must be filled"
        });
    }

    let success;
    let mailOptions;

    let user;

    try {
        user = await User.findOne({ email: email.toLowerCase() })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Email already taken'
        });
    }

    let hash;
    try {

        hash = await bcrypt.hash(password, BCRYPT_ROUND);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!hash) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Password problem"
        });
    }

    const token = jwt.sign({ email: email.toLowerCase() }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    // envoyer ce token par mail a l'adress https://domain.com/auth/verify/:token


    const title = `Hi, ${username}`;
    const text1 = `Welcome to TodoList, thanks for signing up, i hope you'll enjoy this app. Click the link below to activate your account.`;
    const text2 = `If you have any questions or recommandations for the app, feel free to email me via vincent.crys.dev@gmail.com.`;
    const link = {
        text: "Activate My Account",
        href: `${FRONT_BASE_URL}/auth/confirm/account/${token}`
    };

    const verificationPage = mailTemplate(title, text1, text2, link);

    mailOptions = {
        from: NODEMAILER_EMAIL,
        to: email.toLowerCase(),
        subject: "Account Verification",
        html: verificationPage,
    }

    user = new User({
        username: username,
        email: email.toLowerCase(),
        password: hash,
        verify_account_token: token,
        verify_account_expire: new Date(Date.now() + JWT_EXPIRE * 1000)
    });

    try {
        success = await user.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
            err.url = req.url;
        }
        return next(err);
    }

    if (!success) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Fail to create user"
        });
    }

    try {
        await TRANSPORTER.sendMail(mailOptions)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
            err.url = req.url;
        }
        return next(err);
    }

    res.status(statusCodes.CREATED).json({
        message: "User successfully created",
        data: {
            verification_token_expire: JWT_EXPIRE,
        }
    });
}

exports.getVerifyToken = async (req, res, next) => {
    const { token } = req.params;

    let success = false;
    let user;
    try {
        user = await User.findOne({ verify_account_token: token });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }
    if (!user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "There was a problem with this request"
        });
    }

    const today = new Date(Date.now());
    const expireDate = new Date(user.verify_account_expire);

    if (today > expireDate) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "The validation link has expired"
        });
    }

    user.verify_account_expire = null;
    user.verify_account_token = null;

    try {
        success = await user.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!success) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Failed to validate the account"
        });
    }

    const data = jwt.verify(token, JWT_SECRET);

    // Send an email here

    res.status(statusCodes.OK).json({
        message: "Successfully validate the account",
        data: {
            email: data.email
        }
    })
}

exports.postResetPasswordSendLink = async (req, res, next) => {
    const { email } = req.body;

    let success = false;
    let mailOptions;
    let user;

    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "There was a problem with this request"
        });
    }

    const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    const title = `Reset Password`;
    const text1 = `You request for reset password. Click the link below to reset your password.`;
    const text2 = `If you did not requested for reset password, then don't consider this email`;
    const link = {
        text: "Reset My Password",
        href: `${FRONT_BASE_URL}/reset-password/${token}`
    };

    const verificationPage = mailTemplate(title, text1, text2, link);

    mailOptions = {
        from: NODEMAILER_EMAIL,
        to: email,
        subject: "Reset Password",
        html: verificationPage,
    }

    user.reset_password_token = token;
    user.reset_password_expire = new Date(Date.now() + JWT_EXPIRE * 1000);

    try {
        success = await user.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!success) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Failed to send reset password mail"
        });
    }



    try {
        await TRANSPORTER.sendMail(mailOptions);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
            err.url = req.url;
        }
        return next(err);
    }

    res.status(statusCodes.OK).json({
        message: "Successfully sent mail to reset password"
    });
}

exports.postResetPasswordVerifyToken = async (req, res, next) => {
    const { token } = req.params;
    const {
        password,
        confirmPassword
    } = req.body;

    let success = false;
    let user;

    try {
        user = await User.findOne({ reset_password_token: token });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "There was a problem with this request"
        });
    }

    const today = new Date(Date.now());
    const expireDate = new Date(user.reset_password_expire);

    if (today > expireDate) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "The reset link has expired"
        });
    }

    if (password !== confirmPassword || !password) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Password must match"
        });
    }

    let hash;

    try {
        hash = await bcrypt.hash(password, BCRYPT_ROUND);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!hash) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Password problem"
        });
    }

    const title = `Password successfully changed`;
    const text1 = `Your password has successfully been changed.`;

    const verificationPage = mailTemplate(title, text1);

    const { email } = jwt.verify(token, JWT_SECRET);

    mailOptions = {
        from: NODEMAILER_EMAIL,
        to: email,
        subject: "Password changed",
        html: verificationPage,
    }

    user.reset_password_token = null;
    user.reset_password_expire = null;
    user.password = hash;

    try {
        success = await user.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!success) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Failed to reset the password"
        });
    }

    const data = jwt.verify(token, JWT_SECRET);

    try {
        await TRANSPORTER.sendMail(mailOptions);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    res.status(statusCodes.OK).json({
        message: "Password successfully updated",
        data: {
            email: data.email
        }
    })
}