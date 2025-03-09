
const dotenv = require('dotenv');
dotenv.config();


const nodemailer = require("nodemailer");

module.exports.fewMails = async function (req, res, next) {
    try {
        const { email, subject, message, cc, bcc } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Create mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Use email directly
            subject,
            text: message,
        };

        // Add cc and bcc only if they are provided
        if (cc) mailOptions.cc = cc;
        if (bcc) mailOptions.bcc = bcc;

        // Send mail
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Emails sent successfully!", info });

    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Failed to send emails", details: error.message });
    }
};

module.exports.bulkMails = async function (req, res, next) {

    res.status(200).json(req.captain)
}

module.exports.unlimateMails = async function (req, res, next) {

    res.status(200).json(req.captain)
}