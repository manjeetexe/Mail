const express = require('express');
const router = express.Router();
const upload = require('./../Middleware/upload');
const sendMailController = require('./../Controllers/Sendmail.controller')


router.post('/few-mail',   sendMailController.fewMails );
router.post('/bulk-mail', upload.fields([{ name: 'jsonFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), sendMailController.bulkMails);
router.post('/ultimate-mail',   sendMailController.unlimateMails);
router.post('/schedule-mail',   sendMailController.sheduleMails);
router.get("/scheduled-mails", sendMailController.getScheduledEmails );
router.get("/callback", sendMailController.handleOAuthCallback);





module.exports = router 