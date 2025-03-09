const express = require('express');
const router = express.Router();
const sendMailController = require('./../Controllers/Sendmail.controller')


router.post('/register',   sendMailController.fewMails );
router.post('/register',   sendMailController.bulkMails );
router.post('/register',   sendMailController.unlimateMails);





module.exports = router