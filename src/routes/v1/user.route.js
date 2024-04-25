const express = require('express');
const { UserController } = require('../../controller');
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

// login with facebook Auth/user
router
    .route("/login_with_facebook")
    .post(UserController.LoginWithFacebook)


module.exports = router;

