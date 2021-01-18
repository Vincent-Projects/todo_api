const { body } = require('express-validator');

exports.validateLogin = () => {
    return [
        body('email', 'email does not exist').exists().trim().isEmail(),
        body('password', 'No password provided').exists(),
        body('password', 'Password must be 8 characters long').trim().isLength({ min: 8 })
    ]
}