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
exports.sendBulkEmails = async (emails, subject, message, cc, bcc, clientId, clientSecret, authCode) => {
    try {
        // ✅ Get Access Token
        const accessToken = await this.getAccessToken(clientId, clientSecret, authCode);

        // ✅ Authenticate with Access Token
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:8000/auth/callback");
        oauth2Client.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        // ✅ Send emails to each recipient
        for (const email of emails) {
            const rawMessage = createEmail(email, subject, message, cc, bcc);
            await gmail.users.messages.send({
                userId: "me",
                requestBody: { raw: rawMessage },
            });
            console.log(`✅ Email sent to ${email}`);
        }

        return { success: true, message: `Sent ${emails.length} emails successfully!` };
    } catch (error) {
        console.error("❌ Error sending emails:", error);
        throw new Error("Failed to send bulk emails");
    }
};

/**
 * Format email as a Base64 URL-safe string for Gmail API.
 */
function createEmail(to, subject, message, cc, bcc) {
    const emailContent = [
        `To: ${to}`,
        cc ? `Cc: ${cc}` : "",
        bcc ? `Bcc: ${bcc}` : "",
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "",
        message,
    ].join("\n");

    return base64url.encode(emailContent);
}