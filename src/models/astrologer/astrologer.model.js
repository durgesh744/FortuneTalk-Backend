const mongoose = require('mongoose');
const { toJSON } = require("../../plugin/model.plugin.index");

const astrologerSchema = new mongoose.Schema({
    // email: String,
    // mobileNumber: String,
    // gender: String,
    // password: String,
    // dateOfBirth: Date,
    // completeAddress: String,
    astrologerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    displayName: String,
    realName: String,
    countryPhoneCode: String,


    alternateNumber: String,
    currency: String,

    skill: String,
    language: String,
    experience: String,
    country: String,
    state: String,
    city: String,
    pinCode: String,
    remedies: String,
    offersCategory: String,
    mainExpertise: String,
    followersValue: Number,
    educationalQualification: String,

    profilePic: String,

    idProof: String,
    bankProof: String,
    bankAccountNumber: String,
    accountType: String,
    ifscCode: String,
    accountHolderName: String,
    aadharCardNumber: String,
    panCardNumber: String,

    // display type
    indiaDisplayPrice: Number,
    displayPriceInternational: Number,

    // indian astrologers price perminutes
    astrologerChatPricePerMinute: Number,
    astrologerCallPricePerMinute: Number,

    //indian company call price
    companyCallPrice: Number,
    companyChatPrice: Number,

    // indian video live price
    videoPriceLive: Number,
    companyVideoPriceLive: Number,

    // indian voice
    voicePriceLive: Number,
    companyVoicePriceLive: Number,

    // international astrologers Price
    astrologerCallPriceDollar: Number,
    astrologerChatPriceDollar: Number,

    // international astrologers Price
    companyCallPriceDollar: Number,
    companyChatPriceDollar: Number,

    // international video live price
    videoPriceLiveDollar: Number,
    companyVideoPriceLiveDollar: Number,

    // international voice prices
    voicePriceLiveDollar: Number,
    companyVoicePriceDollar: Number,

    astrologicalQualification: String,
    commissionRemark: String,
    shortBio: String,
    longBio: String,
    gallery: [String],
    options: {
        consultation: Boolean,
        teaching: Boolean,
        panditAtHome: Boolean,
        all: Boolean
    }
});

astrologerSchema.plugin(toJSON);

const Astrologers = mongoose.model('Astrologers', astrologerSchema);

module.exports = Astrologers;
