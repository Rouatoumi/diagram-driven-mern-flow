const nodemailer = require("nodemailer");
require("dotenv").config();

// Log the credentials being used (for debugging purposes)
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

const sendNotificationEmail = async ({
  productName,
  productId,
  bidAmount,
  ownerEmail,
}) => {
  try {
    console.log(`Attempting to send email to: ${ownerEmail}`);
    console.log(`Using sender email: ${process.env.EMAIL_USER}`);

    const mailOptions = {
      from: `Auction Platform <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `New Bid: $${bidAmount} on ${productName}`,
      html: `
        <h2>New Bid on Your Product</h2>
        <p>A new bid has been placed on your product <strong>${productName}</strong>.</p>
        <p><strong>Bid Amount:</strong> $${bidAmount}</p>
        <p><strong>Product ID:</strong> ${productId}</p>
        <p>Please log in to the platform to review the bid.</p>
        <p>Thank you,<br/>The Auction Platform Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email failed: ${error.message}`);
    console.error(`Full error: ${JSON.stringify(error, null, 2)}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = { sendNotificationEmail };
