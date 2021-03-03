const jwt = require('jsonwebtoken');
const { statusCodes } = require('../constants');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization');

    if (!authorization) {
        const error = new Error("No Permissions");
        error.statusCode = statusCodes.UNAUTHORIZED;
        throw error;
        /* return res.status(401).json({
            message: 'You do not have access to this section'
        }); */
    }

    const splitedAuthorization = authorization.split(' ');

    const token_type = splitedAuthorization[0];
    const access_token = splitedAuthorization[1];

    if (!token_type || token_type !== 'Bearer') {
        const error = new Error("Wrong API Use");
        error.statusCode = statusCodes.UNAUTHORIZED;
        throw error;
    }

    if (!access_token) {
        const error = new Error("No Token");
        error.statusCode = statusCodes.UNAUTHORIZED;
        throw error;
        /* return res.status(401).json({
            message: 'Wrong access token'
        }); */
    }

    let verifiedToken;

    try {
        verifiedToken = jwt.verify(access_token, JWT_SECRET);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        throw err;
    }

    if (!verifiedToken) {
        const error = new Error("Empty Token");
        error.statusCode = statusCodes.SERVER_ERROR;
        throw error;
    }

    req.userId = verifiedToken.userId;
    next();
};