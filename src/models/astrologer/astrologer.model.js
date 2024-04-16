const mongoose = require('mongoose');
const { toJSON } = require("../../plugin/model.plugin.index");
const bcrypt = require("bcrypt");

const astrologerSchema = new mongoose.Schema({
    displayName: String,
    realName: String,
    email: String,
    countryPhoneCode: String,
    mobileNumber: String,
    alternateNumber: String,
    currency: String,
    gender: String,
    password: String,
    dateOfBirth: Date,
    skill: String,
    language: String,
    experience: String,
    completeAddress: String,
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

astrologerSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
};

astrologerSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const astrologer = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!astrologer; // return true if user is not null
};

astrologerSchema.statics.isMobileNumberTaken = async function (
    mobileNumber,
    excludeUserId
) {
    const astrologer = await this.findOne({ mobileNumber, _id: { $ne: excludeUserId } });
    return !!astrologer; // return true if user is not null
};

astrologerSchema.statics.getEmails = async function (userIds) {
    const astrologers = await this.find({ _id: { $in: userIds } });
    return astrologers.map((user) => user.email);
};

astrologerSchema.pre("save", async function (next) {
    if (
        this.isModified("name") &&
        this.profile_image?.includes("ui-avatars.com") || this.profile_image?.includes("ui-avatars.com")
    ) {
        this.profile_image = `https://ui-avatars.com/api/?background=random&size=128&rounded=true&format=png&name=${this.name}`;
    }
    
    
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});


const Astrologers = mongoose.model('Astrologers', astrologerSchema);
module.exports = Astrologers;
