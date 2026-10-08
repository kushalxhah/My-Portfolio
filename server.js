import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer to handle file uploads in memory (max 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB soft limit handled by Express
});

// Email Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Name Validation Regex (Letters and spaces only)
const nameRegex = /^[A-Za-z\s]+$/;

// API Route for Contact Form Submission
app.post('/api/contact', upload.single('attachment'), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const file = req.file;

    // 1. Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, Email, and Message are required fields.' });
    }

    // 2. Validate Name format (no numbers)
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'Name must contain letters and spaces only.' });
    }

    // 3. Validate Email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Configure SMTP Transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your Gmail or SMTP user
        pass: process.env.SMTP_PASS  // Your Gmail App Password or SMTP pass
      }
    });

    // Construct HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Contact Message Received</h2>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Sender Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Sender Email:</td>
            <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
          </tr>
        </table>

        <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-left: 4px solid #cbd5e1; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #475569; font-size: 1rem;">Message Content:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #0f172a; margin: 0;">${message}</p>
        </div>

        <footer style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b; text-align: center;">
          This message was sent securely from your online portfolio contact form.
        </footer>
      </div>
    `;


    // Configure email options
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: 'kushalkshah1606@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: htmlBody
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('SMTP Email Error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Error handling for Multer file size limits
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Attachment file size exceeds the 10MB limit.' });
  }
  next(err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
