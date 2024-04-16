const express = require('express');
const router = express.Router();
const { AstrologerControllor } = require('../../../controller');

router
    .route('/')
    .post(AstrologerControllor.CreateAstrologer)
    .get(AstrologerControllor.GetAstrologers)

router
    .route('/:id')
    .put(AstrologerControllor.UpdateAstrologer)


module.exports = router;

