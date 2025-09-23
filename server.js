require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sgMail = require('@sendgrid/mail'); // <-- SendGrid

const app = express();

// CORS setup
app.use(cors({
  origin: ""
}));

app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST route for form submission
app.post("/submit-form", async (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ error: "Please complete all fields." });
  }

  const text = `Dear ${name},

Congratulations! This email confirms that you have successfully completed the Gurusoft Cybersecurity Training.

${message}

Thank you once again for your commitment to cybersecurity.

Best Regards,
Gurusoft Pte Ltd (HR)

(This is a system generated email, please do not reply to this message.)`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM, // verified sender
    subject: "Confirmation of Cybersecurity Training Completion",
    text
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, message: "Form submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Fallback: serve frontend for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
