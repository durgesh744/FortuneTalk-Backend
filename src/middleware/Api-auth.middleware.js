const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const { Auth } = require("../models");

const verifyCallback = (req, res, next, permission = "") => async (err, response) => {
    try {
        if (err)
            throw new ErrorResponse(
                `token expired or invalid token, please try again with valid jwt token`,
                403
            );

        req.user = response;
        const user = await Auth.findById(req.user.user_id);
        if (!user) {
            throw new ErrorResponse(
                `User not found`,
                400
            );
        }
        req.user_detail = user;
        next();
    } catch (err) {
        res.status(err.statusCode).json({
            success: false,
            data: err.message,
        });
    }
};

/**
 * This function works as a middleware to protect routes and verifying access
 * @param {String} permission permission required to access the route
 * @returns {Function} Express middleware function
 */
const auth = (permission) => (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];


    if (token == null) {
        throw new ErrorResponse(
            `unauthorized, please provide a valid jwt token`,
            401
        );
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        verifyCallback(req, res, next, permission)
    );
};


const AccessDomain = (req, res, next) => {
    const { origin } = req.headers;
    let access = String(process.env.API_ACCESS).split(",").includes(origin);
    if (!access) {
        throw new ErrorResponse(
            `you don't have access`,
            401
        );
    };

    next()
}

module.exports = {
    auth,
    AccessDomain
};
