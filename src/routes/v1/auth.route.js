const express = require('express');
const { AuthController } = require('../../controller');
const router = express.Router();

router
    .route('/:id')
    .put(AuthController.UpdateUser)

router
    .route("/")
    .get(AuthController.getUser)

router
    .route('/login_with_google')
    .post(AuthController.LoginWithGoogle)

router
    .route("/otp")
    .post(AuthController.send_OTP)

router
    .route("/login_with_facebook")
    .post(AuthController.LoginWithFacebook)


module.exports = router;

