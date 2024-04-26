const { Astrologer } = require("../../models");
const { CreateAstrologerServices } = require("../../service");
const asyncHandler = require("../../middleware/asyncHandler");

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const CreateAstrologer = asyncHandler(async (req, res) => {
    const newAstrologer = await CreateAstrologerServices.createAccount(req.body);
    res.status(201).json({ success: true, newAstrologer });
})

/**
 * This function is used to update user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const UpdateAstrologer = asyncHandler(async (req, res) => {
    const updatedAstrologer = await CreateAstrologerServices.updateAustrologerById(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedAstrologer });
});

/**
 * This function is used to get user by query
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const GetAstrologers = asyncHandler(async (req, res) => {
    res.status(200).send({ success: true, data: await Astrologer.find({}).populate('astrologerId') })
})

/**
 * This function is used to login astrologer 
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const LoginAstrologer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await CreateAstrologerServices.loginWithEmailAndPass(email, password);
    const jwt = user.jwt;

    return res.status(200).json({ success: true, user, jwt, msg: "Login Successfully" });
});

module.exports = {
    CreateAstrologer,
    GetAstrologers,
    UpdateAstrologer,
    LoginAstrologer,
};
