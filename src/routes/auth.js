const express = require('express');

const authController = require('../controllers/authController');
const validator = require('../middleware/validator');

const authRoutes = express.Router();

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