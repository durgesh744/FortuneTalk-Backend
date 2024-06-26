const ErrorResponse = require("../../utils/ErrorResponse");
const { Astrologer, Auth, User } = require("../../models");
const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = require("../../helpers/generateToken");

/**
 * create account as new user
 * @param {Object} userBody express request body
 * @returns {Promise<Auth>}
 */

const createAccount = async (userBody) => {
    const data = { ...userBody };

    if (await User.isEmailTaken(data.email))
        throw new ErrorResponse("Email already taken", 400);

    if (await User.isPhoneTaken(data.mobileNumber))
        throw new ErrorResponse("Mobile Number already taken", 400);


    const user = await User.create({ ...data, type: "astrologer" });
    const otherDetails = await Astrologer.create({ ...data, astrologerId: user._id });
    const jwt = generateToken(user)

    return { user, otherDetails, jwt };
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
    console.log(password)
    if (!JWT_SECRET) throw new ErrorResponse("JWT_SECRET not set", 500);
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorResponse("Email not found", 400);
    }

    if (user.type != "astrologer")
        throw new ErrorResponse("Type is Invalid", 400);

    if (!user.isPasswordMatch(password))
        throw new ErrorResponse("Password is Invalid", 400);

    const jwt = generateToken(user)
    delete user.password;
    return {
        user,
        jwt,
    };
};

module.exports = {
    createAccount,
    updateAustrologerById,
    loginWithEmailAndPass,
    loginWithEmailAndPass
};
