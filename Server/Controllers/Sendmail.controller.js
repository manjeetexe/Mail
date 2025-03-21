
const dotenv = require('dotenv');
dotenv.config();
const transporter = require("./../config/transpoter");
const scheduledEmails = [];
const fs = require('fs');
const pdfParse = require('pdf-parse');
const sendEmailService = require('../Services/sendEmail.service');
const Mail = require('nodemailer/lib/mailer');



const oauthCredentials = {};
const Maildata = {};

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


exports.handleOAuthCallback = async (req, res) => {
    try {
        const { code } = req.query;

        // Ensure oauthCredentials are properly set
        const { clientSecret, clientId, redirectUri } = oauthCredentials;

        if (!code || !clientId || !clientSecret || !redirectUri) {
            return res.status(400).json({ error: "Missing required parameters!" });
        }

        console.log("Auth Code:", code);
        console.log("Client ID:", clientId);
        console.log("Client Secret:", clientSecret);
        console.log("Redirect URI:", redirectUri);

        // ✅ Get tokens dynamically
        const tokens = await sendEmailService.exchangeCodeForTokens(code, clientId, clientSecret, redirectUri);

        if (!tokens || !tokens.access_token) {
            return res.status(500).json({ error: "Failed to retrieve access token" });
        }

        // Ensure Maildata is defined
        if (!Maildata || !Maildata.emails || !Maildata.subject || !Maildata.message) {
            return res.status(400).json({ error: "Missing email data" });
        }

        const { message, subject, cc, bcc, emails } = Maildata;

        // ✅ Send bulk emails
        const response = await sendEmailService.sendBulkEmails(clientId, clientSecret, tokens, emails, subject, message, cc, bcc);

        return res.json({ success: true, response });

    } catch (error) {
        console.error("❌ Error in handleOAuthCallback:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.bulkMails = async (req, res) => {
    try {
        const {email, subject, message, cc, bcc } = req.body;

        Maildata.subject = subject,
        Maildata.message = message,
        Maildata.cc = cc,
        Maildata.bcc = bcc

        const jsonFile = req.files?.jsonFile ? req.files.jsonFile[0] : null;
        const pdfFile = req.files?.pdfFile ? req.files.pdfFile[0] : null;

        console.log("📩 Received Headers:", req.headers);
        console.log("📩 Received Body:", req.body);
        console.log("📩 Received Files:", req.files);

        if (!jsonFile || !pdfFile) {
            console.error("❌ Missing Files!", req.files);
            return res.status(400).json({ error: "Both JSON and PDF files are required!" });
        }

        // ✅ Extract Gmail API Credentials from JSON File
        let clientSecret;
        try {
            const jsonData = JSON.parse(jsonFile.buffer.toString("utf-8"));
            clientSecret = jsonData.installed.client_secret;
            clientId = jsonData.installed.client_id;
            redirectUri = "http://localhost:8000/auth/callback"

            oauthCredentials.clientSecret = clientSecret
            oauthCredentials.clientId = clientId
            oauthCredentials.redirectUri = redirectUri
            



            
        } catch (error) {
            console.error("❌ JSON Parsing Error:", error);
            return res.status(400).json({ error: "Invalid JSON file format!" });
        }

        // ✅ Convert PDF Buffer to Uint8Array & Extract Emails
        let emails = [];
        try {
            const pdfBuffer = new Uint8Array(pdfFile.buffer); // Convert buffer properly
            const pdfData = await pdfParse(pdfBuffer);
            console.log("📜 Extracted PDF Text:", pdfData.text);

            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            emails = pdfData.text.match(emailRegex) || [];
        } catch (error) {
            console.error("❌ PDF Parsing Error:", error);
            return res.status(400).json({ error: "Failed to extract emails from PDF!" });
        }

        if (emails.length === 0) {
            console.error("❌ No valid emails found in PDF!");
            return res.status(400).json({ error: "No valid emails found in the PDF!" });
        }

        Maildata.emails = emails

        console.log("✅ Extracted Emails:", emails);
        console.log("✅ Client Secret:", clientSecret);
        console.log("✅ Client Id", clientId)

        // ✅ Send Bulk Emails
        const authUrl = await sendEmailService.generateAuthUrl(clientId, clientSecret);
        return res.json({ success: true, authUrl });
        
        res.json(response);
    } catch (error) {
        console.error("❌ Error in bulkMails:", error);
        res.status(500).json({ error: "Failed to send bulk emails" });
    }
};





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