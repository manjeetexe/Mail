require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const bodyParser = require("body-parser");


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







const storage = multer.memoryStorage();
const upload = multer({ storage: storage });





const validateEmailActivity = (email) => {
  // Dummy logic: Randomly mark some emails as inactive
  const inactiveEmails = ["olduser@example.com", "inactive@mail.com"];
  return inactiveEmails.includes(email) ? "Inactive" : "Active";
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

      // Validate each email
      const validatedEmails = emails.map((email) => ({
          email,
          status: validateEmailActivity(email),
      }));

      res.json({ emails: validatedEmails });
  } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ message: "Error processing file." });
  }
});


// API Route to Send Email
app.post("/api/sponsor", async (req, res) => {
  const { name, email } = req.body;

  console.log(email);
  console.log(name);

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  const mailOptions = {                      
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Partnership Opportunity: Amplify Your Brand Reach with Quantum Musing`,
    html: `
      <p>Dear ${name},</p>

      <p>I hope this message finds you well. I am reaching out to explore potential collaboration opportunities between <strong>Quantum Musing</strong> and your esteemed company. With a proven track record of delivering engaging content to a highly targeted audience, I believe we can drive significant brand visibility and ROI for your business.</p>

      <p><strong>Let me introduce myself briefly:</strong></p>
      <p>I am a tech enthusiast and digital content creator specializing in web development, AI, and programming. My content is designed to educate with an entertaining touch, making complex topics accessible and engaging for my audience.</p>

      <p><strong>Here’s a snapshot of my platform's reach:</strong></p>
      <ul>
        <li><strong>Instagram:</strong> 54K+ followers with high engagement.</li>
        <li><strong>Facebook:</strong> Active tech community.</li>
        <li><strong>YouTube:</strong> Growing subscriber base with tech tutorials.</li>
      </ul>

      <p>My audience trusts my recommendations, presenting an excellent opportunity for your brand to connect with a relevant and passionate demographic. Whether through product reviews, tutorials, or promotional content, I can help your brand achieve authentic reach and measurable engagement.</p>

      <p><strong>Why Partner with Me?</strong></p>
      <ul>
        <li><strong>Targeted Audience:</strong> My content resonates with a tech-savvy demographic.</li>
        <li><strong>High Engagement:</strong> Ensures that your brand message is actively seen and interacted with.</li>
        <li><strong>Authenticity:</strong> Organic and natural collaborations enhance brand credibility.</li>
      </ul>

      <p>If this opportunity aligns with your marketing goals, I would love to discuss how we can collaborate to create a campaign that resonates with my audience and delivers tangible results for your brand.</p>

      <p>Looking forward to hearing from you!</p>

      <p>Best regards,</p>
      <p><strong>Quantum Musing</strong><br>
      Digital Content Creator & Tech Enthusiast<br>
      <a href="https://www.instagram.com/yashudeveloper">@yashudeveloper</a><br>
      Email: ${process.env.EMAIL_USER}<br>
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});



















 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});