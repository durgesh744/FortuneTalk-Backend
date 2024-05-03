const express = require('express');
const router = express.Router();
const { AstrologerControllor } = require('../../../controller');

// create and get astrologer
router
    .route('/')
    .post(AstrologerControllor.CreateAstrologer)
    .get(AstrologerControllor.GetAstrologers)

router
    .route('/login')
    .post(AstrologerControllor.LoginAstrologer)

// update astologer
router
    .route('/:id')
    .put(AstrologerControllor.UpdateAstrologer)

    // get astrologer profile
router
    .route('/profile/:id')
    .get(AstrologerControllor.getProfile)


module.exports = router;

