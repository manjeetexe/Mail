const axios = require('axios')



module.exports.checkSpamMail = async function (req, res, next) {
    try {
        const { emailContent } = req.body;
    
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
      } catch (error) {
        console.error("Error checking spam:", error);
        res.status(500).json({ error: "Failed to check spam" });
      }
}

module.exports.validateMail = async function (req, res, next) {

    res.status(200).json(req.captain)
}

module.exports.trackMails = async function (req, res, next) {

    res.status(200).json(req.captain)
}