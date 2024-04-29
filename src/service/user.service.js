const { User } = require("../models");
const { default: axios } = require("axios");
const otpGenerator = require("otp-generator");
const { default: generateToken } = require("../helpers/generateToken");

/**
 * create account as new user
 * @param {Object} userBody express request body
 * @returns {Promise<User>}
 */

const createAccount = async (userBody) => {
    const data = { ...userBody };
    const user = await User.create(data);
    const token = generateToken(user)
    return { user, token }
};

/**
 * Generate OTP as new user or existing
 * @param {string} phone express request body
 * @returns {Promise<User>}
 */

const send_SMS = async (phone) => {
    const OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    const url = `https://trans.smsfresh.co/api/sendmsg.php?user=AstrovedhaS&pass=123456&sender=ASTOVD&phone=${phone}&text=${OTP}%20is%20the%20one%20time%20password%20for%20FortuneTalk%20App%20-%20Astrovedha%20Shastra%20Pvt%20Ltd&priority=ndnd&stype=normal`;
    await axios.get(url).catch((err) => {
        console.log(err)
    })
    return OTP
}

/**
 * Update as existing user
 * @param {Object} updateBody express request body
 * @returns {Promise<User>}
 */

const updateUserById = async (id, updateBody) => {
    const user = await User.findOne({ _id: id });
    if (!user) throw new ApiError(404, "User not found");

    const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...updateBody } },
        { new: true }
    );

    await updatedUser.save();
    return updatedUser;
};


module.exports = {
    createAccount,
    updateUserById,
    send_SMS
};
