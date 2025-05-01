const axios = require('axios')



module.exports.checkSpamMail = async function (req, res, next) {
  try {
      const { fromEmail, toEmail, subject, message } = req.body;

      // Constructing properly formatted email
      const emailContent = [
        `From: ${fromEmail}`,
        `To: <${toEmail}>`,  // ✅ Brackets added
        `Subject: ${subject}`,
        `Date: ${new Date().toUTCString()}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="boundary123"`, // ✅ Multi-part email
        ``,
        `--boundary123`,
        `Content-Type: text/plain; charset=UTF-8`,
        ``,
        `This is the plain text version of the email.`,
        ``,
        `--boundary123`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        `<html><body>${message}</body></html>`,  // ✅ Proper HTML structure
        ``,
        `--boundary123--`
    ].join("\n");

      console.log("Formatted Email Content:", emailContent);

      // Sending email content to spam check API
      const response = await axios.post(
          "https://spamcheck.postmarkapp.com/filter",
          { email: emailContent, options: "long" },
          {
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
              },
          }
      );

      res.json(response.data);
      console.log(response.data)
  } catch (error) {
      console.error("Error checking spam:", error);
      res.status(500).json({ error: "Failed to check spam" });
  }
};

module.exports.validateMail = async function (req, res, next) {

    res.status(200).json(req.captain)
}

module.exports.trackMails = async function (req, res, next) {

    res.status(200).json(req.captain)
}