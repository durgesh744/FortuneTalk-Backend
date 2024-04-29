const generateToken = require("../helpers/generateToken");
const asyncHandler = require("../middleware/asyncHandler");
const { User } = require("../models");
const { UserService } = require("../service");

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const LoginWithGoogle = asyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        const newUser = await UserService.createAccount(req.body);
        user = newUser.user
    }
    res.status(201).json({ success: true, data: user });
})

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const LoginWithFacebook = asyncHandler(async (req, res) => {
    let user = await User.findOne({ fb_id: req.body.fb_id })
    if (user) {
        const newUser = await UserService.createAccount({ fb_id: req.body.fb_id, fname: req.body.username });
        user = newUser.user
    }
    res.status(201).json({ success: true, data: user });
});

/**
 * This function is used to createAccount a user and send otp
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const send_OTP = asyncHandler(async (req, res) => {
    let user = await User.findOne({ phone: req.query.number })
    if (!user) {
        const newUser = await UserService.createAccount({ phone: req.query.number });
        user = newUser.user
    }
    const otp = await UserService.send_SMS(req.query.number)
    const jwt = generateToken(user)
    res.status(200).send({ success: true, otp, user, jwt });
})

/**
 * This function is used to get user by query
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const getUser = asyncHandler(async (req, res) => {
    res.status(200).send({ success: true, user: await User.findOne({ _id: req.query.id }) })
})

/**
 * This function is used to update user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const UpdateUser = asyncHandler(async (req, res) => {
    const updateUser = await UserService.updateUserById(req.params.id, req.body);
    res.status(200).json({ success: true, data: updateUser });
});

module.exports = {
    LoginWithGoogle,
    LoginWithFacebook,
    send_OTP,
    getUser,
    UpdateUser
};
