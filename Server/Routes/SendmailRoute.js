const express = require('express');
const router = express.Router();
const sendMailController = require('./../Controllers/Sendmail.controller')


router.post('/few-mail',   sendMailController.fewMails );
router.post('/bulk-mail',   sendMailController.bulkMails );
router.post('/ultimate-mail',   sendMailController.unlimateMails);





module.exports = router