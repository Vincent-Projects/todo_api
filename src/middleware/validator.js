const { body, param } = require('express-validator');

exports.validateLogin = () => {
    return [
        body('email', 'email does not exist').exists().trim().isEmail(),
        body('password', 'No password provided').exists(),
        body('password', 'Password must be 8 characters long').trim().isLength({ min: 8 })
    ];
};

exports.validateSignup = () => {
    return [
        body('username')
            .trim()
            .exists()
            .withMessage('username is empty')
            .isLength({ min: 3, max: 30 })
            .withMessage('username should be between 3 to 30 characters')
            .isAlphanumeric()
            .withMessage('Should contains only alphanumeric values'),
        body('email')
            .trim()
            .exists()
            .withMessage('username is empty')
            .isEmail()
            .withMessage('input don\'t match email'),
        body('password')
            .trim()
            .exists()
            .withMessage('username is empty')
            .isLength({ min: 8 })
            .withMessage('password should be at least 8 characters')
            .matches(/[@*&$!.?<>£]/)
            .withMessage('Should contains at least one special characters ( @ * & $ ! . ? < > £ )')
            .matches(/\d/)
            .withMessage('should contains at least one numbers')
            .matches(/[a-z]/)
            .withMessage('Should contains at least on lower case character')
            .matches(/[A-Z]/)
            .withMessage('Should contains at least on uppercase character'),
        body('confirm')
            .trim()
            .exists()
            .withMessage('confirm password is empty'),
    ];
};

exports.validatePostTask = () => {
    return [
        body('task')
            .exists()
            .withMessage('Task is empty')
    ];
};

exports.validateDeleteTaskId = () => {
    return [
        param('todoId')
            .exists()
            .isMongoId()
            .withMessage('Id does not match Mongodb ObjectId')
    ];
};

exports.validatePutTodo = () => {
    return [
        body('id')
            .exists()
            .withMessage('Must provide the id of the task')
    ];
};