const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
const { Auth } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");
const { default: axios } = require("axios");

const generateToken = async (user_id) => {
    const user = await Auth.findOne({ _id: user_id });
    if (!user) throw new ErrorResponse("Auth not found", 404);

    const date = new Date();
    if (!user.resetToken.token || user.resetToken.expiry <= date) {
        const buffer = crypto.randomBytes(32);
        const token = buffer.toString("hex");
        const date = new Date();
        date.setDate(date.getDate() + 1);
        await Auth.findOneAndUpdate(
            { _id: user_id },
            {
                resetToken: {
                    token,
                    expiry: date,
                },
            }
        );
        return token;
    }

    return user.resetToken.token;
};

/**
 * Sign up as new user
 * @param {Object} userBody express request body
 * @returns {Promise<Auth>}
 */

const createAccount = async (userBody) => {
    const data = { ...userBody };
    if (await Auth.isEmailTaken(data.email))
        throw new ErrorResponse("Email already taken", 400);

    if (await Auth.isphoneTaken(data.phone))
        throw new ErrorResponse("Phone Number already taken", 400);

    const user = await Auth.create(data);
    const token = jwt.sign(
        {
            name: user.fname,
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

    const send_SMS = () => {
        axios.post("http://trans.smsfresh.co/api/sendmsg.php?user=AstrovedhaS&pass=********&sender=Sender ID&phone=8052941488&text=Test SMS&priority=Priority&stype=smstype")
    }

    console.log(send_SMS())
    return { user, jwt: { token, expiry: date.toISOString() } };
};

const send_SMS =(phone , msg)=>{
    const url = `https://trans.smsfresh.co/api/sendmsg.php?user=AstrovedhaS&pass=123456&sender=ASTOVD&phone=${phone}&text=${encodeURIComponent(msg)}%20is%20the%20one%20time%20password%20for%20FortuneTalk%20App%20-%20Astrovedha%20Shastra%20Pvt%20Ltd&priority=ndnd&stype=normal`;

    axios.get(url)
      .then(response => {
        console.log(response)
        return  response.data 
      })
      .catch(error => {
        console.error('Error:', error); 
      });
}

const updateAuthById = async (id, updateBody) => {
    const user = await Customer.findOne({ _id: id });
    if (!user) throw new ApiError(404, "User not found");

    if (
        updateBody.email &&
        (await Customer.isEmailTaken(updateBody.email, id)) &&
        updateBody.email !== user.email
    )
        throw new ApiError(400, "Email already taken");

    if (
        updateBody.phone &&
        (await Customer.isphoneTaken(updateBody.phone, id)) &&
        updateBody.phone !== user.phone
    )
        throw new ApiError(400, "Telephone already taken");

    const updatedAuth = await Auth.findOneAndUpdate(
        { _id: id },
        { $set: { ...updateBody } },
        { new: true }
    ).select("-password");

    await updatedAuth.save();
    return updatedAuth;
};




module.exports = {
    generateToken,
    createAccount,
    updateAuthById,
    send_SMS
};
