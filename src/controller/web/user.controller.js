const generateToken = require("../../helpers/generateToken");
const asyncHandler = require("../../middleware/asyncHandler");
const { User } = require("../../models");
const { UserService } = require("../../service");

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
    let user = await User.findOne({ phone: req.query.number });
    let isNewUser = false;
    let otp;

    if (!user) {
        // If user doesn't exist, create a new account
        otp = await UserService.send_SMS(req.query.number);
        const newUser = await UserService.createAccount({ phone: req.query.number, otp });
        user = newUser.user;
        isNewUser = true;
    } else {
        // If user exists, update the OTP
        otp = await UserService.send_SMS(req.query.number);
        user.otp = otp;
        await user.save();
    }

    // Generate token
    const jwt = generateToken(user);

    // Send response
    res.status(200).send({ success: true, otp, user, jwt, isNewUser });
});


/**
 * This function is used to verify OTP and create an account if the user doesn't exist.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object along with OTP
 */

const verify_OTP = asyncHandler(async (req, res) => {
    const { phone, otp } = req.query;

    if (!phone) {
        return res.status(400).send({ success: false, message: "Phone number is required" });
    }
    if (!otp) {
        return res.status(400).send({ success: false, message: "OTP is required" });
    }

    // Find user by phone number
    let user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }

    // Verify OTP
    if (otp != user.otp) {
        return res.status(400).send({ success: false, message: "Invalid OTP" });
    }

    // Generate JWT token
    const jwt = generateToken(user);

    // Send response
    res.status(200).send({ success: true, otp, user, jwt });
});


/**
 * This function is used to resend otp by user 
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */
const resend_OTP = asyncHandler(async (req, res) => {
    const { phone } = req.query;

    if (!phone) {
        return res.status(400).send({ success: false, message: "Phone number is required" });
    }

    // Find user by phone number
    let user = await User.findOne({ phone });

    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }

    // Send OTP via SMS
    const newOTP = await UserService.send_SMS(phone)

    // Update user's OTP in the database
    user.otp = newOTP;
    await user.save();


    // Generate JWT token
    const jwt = generateToken(user);

    // Send response
    res.status(200).send({ success: true, otp: newOTP, user, jwt });
});


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
    verify_OTP,
    resend_OTP,
    getUser,
    UpdateUser
};
