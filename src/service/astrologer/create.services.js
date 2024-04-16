const jwt = require("jsonwebtoken");
const ErrorResponse = require("../../utils/ErrorResponse");
const { Astrologer } = require("../../models");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * create account as new user
 * @param {Object} userBody express request body
 * @returns {Promise<Auth>}
 */

const createAccount = async (userBody) => {
    const data = { ...userBody };

    if (await Astrologer.isEmailTaken(data.email))
        throw new ErrorResponse("Email already taken", 400);

    if (await Astrologer.isMobileNumberTaken(data.mobileNumber))
        throw new ErrorResponse("Mobile Number already taken", 400);

    const user = await Astrologer.create(data);
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

const updateAustrologerById = async (id, updateBody) => {
    const astrologer = await Astrologer.findOne({ _id: id });
    if (!astrologer) throw new ApiError(404, "User not found");

    const updatedAstrologer = await Astrologer.findOneAndUpdate(
        { _id: id },
        { $set: { ...updateBody } },
        { new: true }
    );

    await updatedAstrologer.save();
    return updatedAstrologer;
};


module.exports = {
    createAccount,
    updateAustrologerById
};
