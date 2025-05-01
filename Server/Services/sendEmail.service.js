const { google } = require("googleapis");
const base64url = require("base64url");


/**
 * Generate an OAuth2 URL for user authentication.
 */
exports.generateAuthUrl = async (clientId, clientSecret) => {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:8000/auth/callback");

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.send"],
    });

    console.log("🔗 Generated Auth URL:", authUrl);
    return authUrl;
};

/**
 * Exchange authorization code for access token.
 */

exports.exchangeCodeForTokens = async (code, clientId, clientSecret, redirectUri) => {
    try {
        // ✅ Define oauth2Client inside the function
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        // ✅ Exchange auth code for access & refresh tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log("✅ Tokens received:", tokens);
        return tokens; // Return tokens for use in email sending
    } catch (error) {
        console.error("❌ Error getting tokens:", error);
        throw error;
    }
};





/**
 * Send bulk emails using Gmail API.
 */
exports.sendBulkEmails = async (clientId, clientSecret, tokens, emails, subject, message, cc = "", bcc = "") => {
    try {
        const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:8000/auth/callback");
        oAuth2Client.setCredentials(tokens);

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

        const results = [];

        for (const email of emails) {
            try {
                const emailData = [
                    `To: ${email}`,
                    `From: your-email@example.com`, // Sender email
                    `Subject: ${subject}`,
                    `CC: ${cc}`,
                    `BCC: ${bcc}`,
                    `MIME-Version: 1.0`,
                    `Date: ${new Date().toUTCString()}`, // Add current date
                    `Message-ID: <${Date.now()}@example.com>`, // Unique ID for tracking
                    `Content-Type: text/html; charset=UTF-8`, // Ensure HTML content
                    "",
                    `${message}`, // Your HTML message content
                ].join("\n");

                const encodedMessage = Buffer.from(emailData).toString("base64");

                const response = await gmail.users.messages.send({
                    userId: "me",
                    requestBody: {
                        raw: encodedMessage,
                    },
                });

                results.push({ email, status: "Sent", response });

                console.log(`✅ Email sent to: ${email}`);

                // Wait for 1 second before sending the next email
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Failed to send email to: ${email}`, error);
                results.push({ email, status: "Failed", error: error.message });
            }
        }

        return { success: true, message: "Emails processed", results };

    } catch (error) {
        console.error("❌ Error sending bulk emails:", error);
        return { success: false, error: error.message };
    }
};

