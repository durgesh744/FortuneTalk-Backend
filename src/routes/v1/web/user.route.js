const express = require('express');
const { UserController } = require('../../../controller/web');
const router = express.Router();

// update Auth/user
router
    .route('/:id')
    .put(UserController.UpdateUser)

// get Auth/user
router
    .route("/")
    .get(UserController.getUser)

// login with google Auth/user
router
    .route('/login_with_google')
    .post(UserController.LoginWithGoogle)

// get otp and create Auth/user
router
    .route("/otp")
    .post(UserController.send_OTP)

// verify otp 
router
    .route("/verify_OTP")
    .post(UserController.verify_OTP)

// resend_OTP 
router
    .route("/resend_OTP")
    .post(UserController.resend_OTP)

// login with facebook Auth/user
router
    .route("/login_with_facebook")
    .post(UserController.LoginWithFacebook)


module.exports = router;

