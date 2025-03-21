require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const bodyParser = require("body-parser");
const axios = require('axios');


const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




app.post('/api/spam-check', async (req, res) => {
  try {
    const { emailContent } = req.body;

    const response = await axios.post('https://spamcheck.postmarkapp.com/filter', {
      email: emailContent,
      options: 'long'
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error checking spam:', error);
    res.status(500).json({ error: 'Failed to check spam' });
  }
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const upload2 = multer({ dest: "uploads/" });

// Dummy function to validate email activity
const validateEmailActivity = (email) => {
    // Dummy logic: Mark some emails as inactive
    const inactiveEmails = ["olduser@example.com", "inactive@mail.com"];
    return inactiveEmails.includes(email) ? "Inactive" : "Active";
};



const generatePDF = (emails) => {
  return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      doc.fontSize(16).text("List of Active Emails", { align: "center" }).moveDown();
      emails.forEach((email) => doc.text(email));
      doc.end();
  });
};



// Route to handle PDF file upload
app.post("/validate-emails-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
  }

  try {
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text;

      // Extract emails from the text
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = text.match(emailRegex) || [];

      // Filter only active emails
      const activeEmails = emails.filter((email) => validateEmailActivity(email) === "Active");

      if (activeEmails.length === 0) {
          return res.status(200).json({ message: "No active emails found." });
      }

      // Generate PDF with active emails
      const pdfBuffer = await generatePDF(activeEmails);

      res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=active_emails.pdf",
      });
      res.send(pdfBuffer);
  } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ message: "Error processing file." });
  }
});



// API Route to Send Email
app.post("/api/send-mail", async (req, res) => {
  const { email, cc, bcc, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Email, subject, and message are required." });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email." });
  }
});








const extractEmails = (text) => {
  return text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
};


app.post("/api/send-mail-bulk", upload2.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const emails = extractEmails(pdfData.text);
    if (emails.length === 0) return res.status(400).json({ error: "No valid emails found in PDF" });

    const { cc, bcc, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(","),
      cc: cc ? cc.split(",").map((e) => e.trim()) : [],
      bcc: bcc ? bcc.split(",").map((e) => e.trim()) : [],
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({ success: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email." });
  }
});







 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});