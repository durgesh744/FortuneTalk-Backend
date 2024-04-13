const asyncHandler = require("../middleware/asyncHandler");
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
    // const {phone, number } = req.body
    let  phone = 8052941488
   let  msg = "5650 hi otp"
    const otp = await AuthService.send_SMS(phone, msg)
    res.status(200).send({ success: true, data: otp });

    console.log(otp)
})

module.exports = {
    createAccount,
    updateAuthById,
    send_OTP
};
