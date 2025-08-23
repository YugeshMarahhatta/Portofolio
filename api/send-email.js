const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  // Use environment variables for credentials!
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL, // e.g. yugeshmarahatta@gmail.com
      pass: process.env.MY_EMAIL_PASS, // e.g. Test@#789
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.MY_EMAIL,
      subject: `Portfolio Contact: ${name}`,
      text: message,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email." });
  }
}
