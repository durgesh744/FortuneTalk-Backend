const mongoose = require("mongoose");
const { toJSON } = require("../../plugin/model.plugin.index");

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            trim: false,
            require: false,
        },
        lastname: {
            type: String,
            trim: false,
            require: false,
        },
        profile_image: {
            type: String,
            trim: true,
            default: `https://ui-avatars.com/api/?background=random&size=128&rounded=true&format=png&name=${this.name}`,
        },
        email: {
            type: String,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email address",
            ],
            unique: false,
            lowercase: false,
            required: [false, "Please provide a email address"],
            sparse: true,
        },
        phone: {
            type: String,
            require: [true, "Please provide phone Number"],
            trim: false,
        },
        dob: {
            type: Date,
        },
        birth_time: {
            type: String,
            require: false
        },
        birth_place: {
            type: String,
            require: false
        },
        address: {
            type: String,
            require: false
        },
        gender: {
            type: String,
            require: false
        },
        occupation: {
            type: String,
            require: false
        },
        problem: {
            type: String,
            require: false
        },
        fb_id: {
            type: String,
            require: false
        },
        resetToken: {
            token: {
                type: String,
                default: null,
            },
            expiry: {
                type: Date,
                default: null,
            },
        },
    },
    { timestamps: true }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user; // return true if user is not null
};

userSchema.statics.isphoneTaken = async function (
    phone,
    excludeUserId
) {
    const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
    return !!user; // return true if user is not null
};

userSchema.statics.getEmails = async function (userIds) {
    const users = await this.find({ _id: { $in: userIds } });
    return users.map((user) => user.email);
};

userSchema.pre("save", async function (next) {
    if (
        this.isModified("name") &&
        this.profile_image?.includes("ui-avatars.com") || this.profile_image?.includes("ui-avatars.com")
    ) {
        this.profile_image = `https://ui-avatars.com/api/?background=random&size=128&rounded=true&format=png&name=${this.name}`;
    }
});

const Auth = mongoose.model("Auth", userSchema);

module.exports = Auth;
