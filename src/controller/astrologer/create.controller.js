const { Astrologer } = require("../../models");
const { CreateAstrologerServices } = require("../../service");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * This function is used to createAccount a user
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const CreateAstrologer = asyncHandler(async (req, res) => {
    const newAstrologer = await CreateAstrologerServices.createAccount(req.body);
    res.status(201).json({ success: true, data: newAstrologer });
})

/**
 * This function is used to get user by query
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @returns {Object} Returns created user object
 */

const GetAstrologers = asyncHandler(async (req, res) => {
    res.status(200).send({ success: true, user: await Astrologer.findOne({}) })
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

module.exports = {
    CreateAstrologer,
    GetAstrologers,
    UpdateAstrologer
};
