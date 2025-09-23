require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS setup
app.use(cors({
  origin: ""
}));

app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// POST route for form submission
app.post("/submit-form", async (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ error: "Please complete all fields." });
  }

  try {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",          // Gmail SMTP host
    port: 465,                       // SSL port
    secure: true,                    // true for 465
    auth: {
      user: process.env.GMAIL_USER,  // your Gmail
      pass: process.env.GMAIL_PASS   // app password
    },
    tls: { rejectUnauthorized: false } // allow self-signed certs
  });

  const mailOptions = {
    from: `"Gurusoft Pte Ltd" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Confirmation of Cybersecurity Training Completion",
    text: `Dear ${name},

Congratulations! This email confirms that you have successfully completed the Gurusoft Cybersecurity Training.

${message}

Thank you once again for your commitment to cybersecurity.

Best Regards,
Gurusoft Pte Ltd (HR)

(This is a system generated email, please do not reply to this message.)`
  };

  await transporter.sendMail(mailOptions);

  res.json({ success: true, message: "Form submitted successfully!" });

} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Failed to send email." });
}
});
// POST /submit-form ... (your email route above)

// fallback: serve frontend for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

