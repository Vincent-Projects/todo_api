const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authorization = req.get("Authorization").split(" ");


    if (!authorization || authorization.length <= 0) {
        return res.status(401).json({
            message: "You do not have access to this section"
        });
    }

    const token_type = authorization[0];
    const access_token = authorization[1];

    if (!token_type || token_type !== "Bearer" || !access_token) {
        return res.status(401).json({
            message: "Wrong access token"
        });
    }

    let verifiedToken;

    try {
        verifiedToken = jwt.verify(access_token, JWT_SECRET);
    } catch (err) {
        console.log(err);
    }

    req.userId = verifiedToken.userId;
    next();
}