const express = require('express');
const router = express.Router();
const sendMailController = require('./../Controllers/Sendmail.controller')


router.post('/few-mail',   sendMailController.fewMails );
router.post('/bulk-mail',   sendMailController.bulkMails );
router.post('/ultimate-mail',   sendMailController.unlimateMails);
router.post('/schedule-mail',   sendMailController.sheduleMails);
router.get("/scheduled-mails", sendMailController.getScheduledEmails );





module.exports = router 