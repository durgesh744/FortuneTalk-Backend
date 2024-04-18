const jwt = require("jsonwebtoken");
const ErrorResponse = require("../../utils/ErrorResponse");
const { Astrologer, Auth } = require("../../models");
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


/**
 * This function logs in a user with email and password
 * @param {String} email email of the user
 * @param {String} password password of the user
 * @returns {Promise<Object>} {success: true, msg: user, jwt: {token, expiry}
 */

const loginWithEmailAndPass = async (email, password) => {
    if (!JWT_SECRET) throw new ErrorResponse("JWT_SECRET not set", 500);
    const user = await Auth.findOne({ email });
    if (!user) {
        throw new ErrorResponse("Email not found", 400);
    }
    if (!(await user.isPasswordMatch(password)))
        throw new ErrorResponse("Password is incorrect", 400);

    if (user.type != "astrologer")
        throw new ErrorResponse("Type is Invalid", 400);

    const token = jwt.sign(
        {
            name: user.name,
            email: user.email,
            user_id: user._id,
        },
        JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7, // 60*60*24*7 is 7 days, here 60 means 60 seconds
        }
    );

    let date = new Date();
    date.setDate(date.getDate() + 6);
    delete user.password;
    return {
        success: true,
        data: user,
        jwt: { token, expiry: date.toISOString() },
    };
};



module.exports = {
    createAccount,
    updateAustrologerById,
    loginWithEmailAndPass,
    loginWithEmailAndPass
};
