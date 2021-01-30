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
 *  Base Routes /auth
 */

authRoutes.post(
    '/login',
    validator.validateLogin(),
    authController.postLogin
);

authRoutes.post(
    '/signup',
    validator.validateSignup(),
    authController.postSignup
);

authRoutes.get('/verify/:token', authController.getVerifyToken);

authRoutes.post('/reset-password/link', authController.postResetPasswordSendLink);

authRoutes.post('/reset-password/:token', authController.postResetPasswordVerifyToken);

module.exports = authRoutes;