const express = require('express');
const router = express.Router();
const { AstrologerControllor } = require('../../../controller');

// create and get astrologer
router
    .route('/')
    .post(AstrologerControllor.CreateAstrologer)
    .get(AstrologerControllor.GetAstrologers)

// update astologer
router
    .route('/:id')
    .put(AstrologerControllor.UpdateAstrologer)


module.exports = router;

