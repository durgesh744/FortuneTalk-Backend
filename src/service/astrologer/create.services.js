const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Auth } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * create account as new user
 * @param {Object} userBody express request body
 * @returns {Promise<Auth>}
 */

const createAccount = async (userBody) => {
    const data = { ...userBody };

    const user = await Auth.create(data);
    const token = jwt.sign(
        {
            fb_id: user.fb_id,
            email: user.email,
            phone: user.phone,
            userId: user._id,
        },
        JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7, // 60*60*24*7 is 7 days, here 60 means 60 seconds
        }
    );
    let date = new Date();
    date.setDate(date.getDate() + 6);
    return { user, jwt: { token, expiry: date.toISOString() } };
};

/**
 * Update as existing user
 * @param {Object} updateBody express request body
 * @returns {Promise<Auth>}
 */

const updateAuthById = async (id, updateBody) => {
    const user = await Auth.findOne({ _id: id });
    if (!user) throw new ApiError(404, "User not found");

    const updatedAuth = await Auth.findOneAndUpdate(
        { _id: id },
        { $set: { ...updateBody } },
        { new: true }
    );

    await updatedAuth.save();
    return updatedAuth;
};


module.exports = {
    // generateToken,
    createAccount,
    updateAuthById,
    send_SMS
};
