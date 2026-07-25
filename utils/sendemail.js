const nodemailer = require("nodemailer");

// ==========================
// Send Email
// ==========================

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Secure Auth System" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return info;
};

module.exports = sendEmail;