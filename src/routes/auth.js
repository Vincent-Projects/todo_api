const express = require('express');
const rateLimit = require('express-rate-limit')

const authController = require('../controllers/authController');
const validator = require('../middleware/validator');

const authRoutes = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3
});
authRoutes.use(authLimiter);


/**
 * @api {post} /auth/login Log in a user
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 * 
 * @apiParam {String}   email       The user's email.
 * @apiParam {String}   password    The user's password.
 * 
 * @apiSuccess {String} username        The username of the user.
 * @apiSuccess {String} email           The Email of the user.
 * @apiSuccess {String} token           The authentication token that is required for any request. 
 * @apiSuccess {Number} token_expire    The period of time in which the token is valid start at the login.
 * 
 * @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
 * @apiError {Object}     err        Server Side error & DB errors   
 */
authRoutes.post(
    '/login',
    validator.validateLogin(),
    authController.postLogin
);

/**
 * @api {post} /auth/signup Sign up a user
 * @apiName PostSignup
 * @apiGroup Authentication
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 *
 * @apiParam {String}   username    The user pseudo.
 * @apiParam {String}   email       The user's email.
 * @apiParam {String}   password    The user's password.
 * @apiParam {String}   confirm     The user's confirm password. Must be the same as password field.
 *
 * @apiSuccess {String} verification_token_expire        Duration of token sent by email on verification link.
 *
 * @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
 * @apiError {Object}     err        Server Side error & DB errors
 */
authRoutes.post(
    '/signup/:code',
    validator.validateSignup(),
    authController.postSignup
);

/**
 * @api {get} /auth/verify/:token Verify the email token
 * @apiName GetVerifyToken
 * @apiGroup Authentication
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 *
 * @apiParam {String}   email       The user's email or username.
 * @apiParam {String}   password    The user's password.
 *
 * @apiSuccess {String} username        The username of the user.
 * @apiSuccess {String} email           The Email of the user.
 * @apiSuccess {String} token           The authentication token that is required for any request.
 * @apiSuccess {Number} token_expire    The period of time in which the token is valid start at the login.
 *
 * @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
 * @apiError {Object}     err        Server Side error & DB errors
 */
authRoutes.get('/verify/:token', authController.getVerifyToken);

/**
 * @api {post} /auth/reset-password/link Send email with reset token
 * @apiName PostResetPasswordSendLink
 * @apiGroup Authentication
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 *
 * @apiParam {String}   email       The user's email.
 * @apiParam {String}   password    The user's password.
 *
 * @apiSuccess {String} username        The username of the user.
 * @apiSuccess {String} email           The Email of the user.
 * @apiSuccess {String} token           The authentication token that is required for any request.
 * @apiSuccess {Number} token_expire    The period of time in which the token is valid start at the login.
 *
 * @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
 * @apiError {Object}     err        Server Side error & DB errors
 */
authRoutes.post('/reset-password/link', authController.postResetPasswordSendLink);

/**
 * @api {post} /auth/reset-password/:token Verify Reset Password Token
 * @apiName PostResetPasswordVerifyToken
 * @apiGroup Authentication
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 *
 * @apiParam {String}   email       The user's email.
 * @apiParam {String}   password    The user's password.
 *
 * @apiSuccess {String} username        The username of the user.
 * @apiSuccess {String} email           The Email of the user.
 * @apiSuccess {String} token           The authentication token that is required for any request.
 * @apiSuccess {Number} token_expire    The period of time in which the token is valid start at the login.
 *
 * @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
 * @apiError {Object}     err        Server Side error & DB errors
 */
authRoutes.post('/reset-password/:token', authController.postResetPasswordVerifyToken);

module.exports = authRoutes;