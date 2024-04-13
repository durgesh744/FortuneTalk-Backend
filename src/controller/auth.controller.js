const asyncHandler = require("../middleware/asyncHandler");
const { Auth } = require("../models");
const { AuthService } = require("../service");

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const createAccount = asyncHandler(async (req, res) => {
    const user = await AuthService.createAccount(req.body);
    return res.status(201).json({ success: true, data: user });
})

const updateAuthById = asyncHandler(async (req, res) => {
    let user = req.user_detail;
    const profile = await AuthService.updateAuthById(user.id, req.body);
    res.status(200).send({ success: true, data: profile });
});

const send_OTP = asyncHandler(async (req, res) => {
    let user = await Auth.findOne({ phone: req.query.number })
    if (!user) {
        user = await AuthService.createAccount({ phone: req.query.number });
        user = user.user
    }
    const otp = await AuthService.send_SMS(req.query.number)
    res.status(200).send({ success: true, user, new_user: !user });
})

module.exports = {
    createAccount,
    updateAuthById,
    send_OTP
};
