const express = require('express');
const router = express.Router();
const anlysisController = require('./../Controllers/Anlysis.route.controller')


router.post('/checkspam',   anlysisController.checkSpamMail );
router.post('/validate',   anlysisController.validateMail );
router.post('/track',   anlysisController.trackMails);





module.exports = router