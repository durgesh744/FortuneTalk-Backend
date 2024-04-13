const express = require('express');
const { AuthController } = require('../../controller');
const router = express.Router();

router
    .route('/')
    .post(AuthController.createAccount)
    .get(AuthController.send_OTP)

router
    .route("/update")
    .put(AuthController.updateAuthById)


module.exports = router;

