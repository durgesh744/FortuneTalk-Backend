const jwt = require("jsonwebtoken");
const { Auth } = require("../models");
const { default: axios } = require("axios");
const otpGenerator = require("otp-generator")

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
    console.log(token, user)
    return { user, jwt: { token, expiry: date.toISOString() } };
};

/**
 * Generate OTP as new user or existing
 * @param {string} phone express request body
 * @returns {Promise<Auth>}
 */

const send_SMS = async (phone) => {
    const OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    console.log(phone)
    const url = `https://trans.smsfresh.co/api/sendmsg.php?user=AstrovedhaS&pass=123456&sender=ASTOVD&phone=${phone}&text=${OTP}%20is%20the%20one%20time%20password%20for%20FortuneTalk%20App%20-%20Astrovedha%20Shastra%20Pvt%20Ltd&priority=ndnd&stype=normal`;
    await axios.get(url).catch((err) => {
        console.log(err)
    })

    return OTP
}

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
