const express = require('express');
const { AuthController } = require('../../controller');
const router = express.Router();

// update Auth/user
router
    .route('/:id')
    .put(AuthController.UpdateUser)

// get Auth/user
router
    .route("/")
    .get(AuthController.getUser)

// login with google Auth/user
router
    .route('/login_with_google')
    .post(AuthController.LoginWithGoogle)

// get otp and create Auth/user
router
    .route("/otp")
    .post(AuthController.send_OTP)

// login with facebook Auth/user
router
    .route("/login_with_facebook")
    .post(AuthController.LoginWithFacebook)


module.exports = router;

