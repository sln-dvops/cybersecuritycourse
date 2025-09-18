require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

// Allow all origins (simple dev/test)
app.use(cors());

// OR allow only your Netlify domain (recommended for production)
app.use(cors({
  origin: "https://cybersecurity-course-gurusoftpteltd.netlify.app"
}));


const app = express();

const PORT = process.env.PORT || 3000;

// POST route for form submission
app.post("/submit-form", async (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ error: "Please complete all fields." });
  }

  try {
    // Configure Nodemailer (Gmail)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"Gurusoft Pte Ltd" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Confirmation of Cybersecurity Training Completion",
      text: `Dear ${name},

Congratulations! This email confirms that you have successfully completed the Gurusoft Cybersecurity Training.

${message}

Thank you once again for your commitment to cybersecurity.

Best Regards,
Gurusoft Pte Ltd (HR)

(This is a system generated email, please do not reply to this message.)`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Form submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
