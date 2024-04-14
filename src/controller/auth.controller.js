const asyncHandler = require("../middleware/asyncHandler");
const { Auth } = require("../models");
const { AuthService } = require("../service");
const ApiError = require("../utils/ApiError");

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const LoginWithGoogle = asyncHandler(async (req, res) => {
    let user = await Auth.findOne({ email: req.body.email })
    if (!user) {
        const newUser = await AuthService.createAccount(req.body);
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
    let user = await Auth.findOne({ fb_id: req.body.fb_id })
    if (user) {
        const newUser = await AuthService.createAccount({ fb_id: req.body.fb_id, fname: req.body.username });
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
    let user = await Auth.findOne({ phone: req.query.number })
    if (!user) {
        const newUser = await AuthService.createAccount({ phone: req.query.number });
        user = newUser.user
    }
    const otp = await AuthService.send_SMS(req.query.number)
    res.status(200).send({ success: true, otp, user });
})

/**
 * This function is used to get user by query
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const getUser = asyncHandler(async (req, res) => {
    console.log(req.query.id, "lkndskjnf")
    res.status(200).send({ success: true, user: await Auth.findOne({ _id: req.query.id }) })
})

/**
 * This function is used to update user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const UpdateUser = asyncHandler(async (req, res) => {
    console.log(req.params.id)
    const updateUser = await AuthService.updateAuthById(req.params.id, req.body);
    res.status(200).json({ success: true, data: updateUser });
});

module.exports = {
    LoginWithGoogle,
    LoginWithFacebook,
    send_OTP,
    getUser,
    UpdateUser
};
