const Joi = require("joi");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/ErrorResponse");
const pick = require("../utils/pick");

const validationCheck = (data) => {
    for (let key in data) {
        if (!data[key]) {
            return { status: false, errorAt: key };
        }
    }
    return { status: true };
};

/**
 * This function is used to validate password
 * @param {String} password Password to be validated
 * @returns true if password is valid else throws error
 */
const validatePassword = (password) => {
    const specialCharacterFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (password.length < 6) {
        throw new ErrorResponse(
            "Password must contain at least 6 characters",
            400
        );
    } else if (password.search(/[0-9]/) === -1) {
        throw new ErrorResponse(
            "Password must contain at least one number",
            400
        );
    } else if (password.search(/[a-z]/) === -1) {
        throw new ErrorResponse(
            "Password must contain one lower case character",
            400
        );
    } else if (password.search(/[A-Z]/) === -1) {
        throw new ErrorResponse(
            "Password must contain one upper case character",
            400
        );
    } else if (!specialCharacterFormat.test(password)) {
        throw new ErrorResponse(
            "Password must contain one special character",
            400
        );
    } else return true;
};

/**
 * This function is used to validate MongoDb Object Id
 * @param {String} id MongoDb Object Id
 * @returns true if valid else false
 */
const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const validateEmail = (emailAddress) => {
    // let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexEmail =
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;

    if (emailAddress.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
};

const validatePhoneNumber = (input_str) => {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(input_str);
};

const validateURL = (str) => {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator
    return !!pattern.test(str);
};

const getFilledObject = (data) => {
    let result = {};
    for (let key in data) {
        if (data[key]) {
            result[key] = data[key];
        }
    }
    return result;
};

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ["body", "query", "params", "headers"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" } })
        .validate(object);

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(", ");
        return next(new ErrorResponse(errorMessage, 400));
    }
    Object.assign(req, value);
    return next();
};

module.exports = {
    validationCheck,
    validatePassword,
    isValidId,
    validateEmail,
    validatePhoneNumber,
    validateURL,
    getFilledObject,
    validate,
};
