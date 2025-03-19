const nodemailer = require("nodemailer");

exports.sendBulkEmails = async (emails, subject, message, cc, bcc, clientSecret, clientId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "your-email@gmail.com", // Change to your Gmail
                clientId: clientId,  // Keep this from Google Cloud
                clientSecret: clientSecret,  // Use extracted secret from JSON file
                refreshToken: "your-refresh-token", // Keep this from OAuth Playground
                accessToken: "your-access-token" // Generate dynamically
            }
        });

        const mailOptions = {
            from: "your-email@gmail.com",
            to: emails.join(","),
            subject: subject,
            text: message,
            cc: cc || '',
            bcc: bcc || ''
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: "Emails sent successfully!", info };
    } catch (error) {
        console.error("Error sending emails:", error);
        return { success: false, error: "Failed to send emails" };
    }
}