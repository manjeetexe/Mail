
const dotenv = require('dotenv');
dotenv.config();
const transporter = require("./../config/transpoter");
const scheduledEmails = [];


const nodemailer = require("nodemailer");

module.exports.fewMails = async function (req, res, next) {
    try {
        const { email, subject, message, cc, bcc } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }


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


module.exports.sheduleMails = async function (req, res, next) {
    try {
        const { campaignName, emails } = req.body;

        if (!campaignName || !emails || emails.length === 0) {
            return res.status(400).json({ error: "Campaign Name and Emails are required" });
        }

        emails.forEach(email => {
            const scheduleTime = new Date(email.scheduleTime);

            if (scheduleTime > new Date()) {
                scheduledEmails.push({ campaignName, ...email });
                console.log(`Email scheduled for: ${scheduleTime}`);
            } else {
                console.log(`Invalid schedule time for: ${email.to}`);
            }
        });

        res.status(200).json({ message: "Emails scheduled successfully!" });
    } catch (error) {
        console.error("Error scheduling emails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.checkAndSendEmails = () => {
    const now = new Date();

    scheduledEmails.forEach((email, index) => {
        if (new Date(email.scheduleTime) <= now) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email.to,
                cc: email.cc || "",
                bcc: email.bcc || "",
                subject: email.subject,
                text: email.message,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                } else {
                    console.log("Email sent successfully:", info.response);
                    scheduledEmails.splice(index, 1); // Remove email after sending
                }
            });
        }
    });
};

module.exports.getScheduledEmails = (req, res) => {
    res.json({ scheduledEmails });
};