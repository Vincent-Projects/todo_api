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
 * @apiParamExample {json} Request Body Example :
 *      {
 *          "email": "john@smith.com",
 *          "password": "Strong@idh55"
 *      }
 * 
 * @apiSuccess {String} username        The username of the user.
 * @apiSuccess {String} email           The Email of the user.
 * @apiSuccess {String} token           The authentication token that is required for any request. ( see Json Web Token )
 * @apiSuccess {Number} token_expire    The period of time in which the token is valid start at the login. ( Time given in seconds, 24 hours )
 * 
 * @apiSuccessExample {json} Success Response Example :
 *      {
 *          "username": "john_smith",
 *          "email": "john@smith.com",
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *          "token_expire": "86400"
 *      }
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
 * @apiParam {String}   username    The username. ( Sould be 3 characters length minimum, and 30 characters maximum )
 * @apiParam {String}   email       The user's email.
 * @apiParam {String}   password    The user's password. ( Should contains at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 8 character length minimum )
 * @apiParam {String}   confirm     The user's confirm password. Must be the same as password field.
 * 
 * @apiParamExample {json} Request Body Example :
 *      {
 *          "username": "john_smith",
 *          "email": "john@smith.com",
 *          "password": "Strong@idh55",
 *          "confirmPassword": "Strong@idh55"
 *      }
 *
 * @apiSuccess {String} verification_token_expire        Duration of token sent by email on verification link. ( 24 hours, then the activation link become invalid )
 * 
 * @apiSuccessExample {json} Succes Response Example
 *      {
 *          "verification_token_expire": "86400"
 *      }
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
 * @apiParam {String}   token       The token sent to user mailbox using email adress.
 *
 * @apiSuccess {String} email           The Email of the user.
 *
 * @apiSuccessExample {json} Succes Response Example
 *      {
 *          "email": "john@smith.com"
 *      }
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
 *
 * @apiSuccess {String} email           The user's email.
 *
 * @apiSuccessExample {json} Succes Response Example
 *      {
 *          "email": "john@smith.com"
 *      }
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
 * @apiParam {String}   token               The token sent to user mailbox using user email adress. ( given as param to url )
 * @apiParam {String}   password            The user's password.
 * @apiParam {String}   confirmPassword     The user confirm password. Must be the same as password.
 * 
 * @apiParamExample {json} Request Body Example :
 *      {
 *          "password": "Strong@idh55",
 *          "confirmPassword": "Strong@idh55"
 *      }
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