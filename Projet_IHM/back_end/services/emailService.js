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

/**
 * Send notification email for new bids or auction results
 * @param {Object} params - Email parameters
 * @param {string} params.productName - Name of the product
 * @param {string} params.productId - ID of the product
 * @param {number} params.bidAmount - Amount of the bid
 * @param {string} [params.ownerEmail] - Email of the product owner (for bid notifications)
 * @param {string} [params.winnerEmail] - Email of the winning bidder (for winner notifications)
 * @param {string} [params.winnerName] - Name of the winning bidder
 * @param {string} [params.type='bid'] - Type of notification ('bid' or 'winner')
 */
const sendNotificationEmail = async ({
  productName,
  productId,
  bidAmount,
  ownerEmail,
  winnerEmail,
  winnerName,
  type = 'bid' // Default to bid notification
}) => {
  try {
    // Determine recipient based on email type
    const to = type === 'winner' ? winnerEmail : ownerEmail;
    console.log(`Attempting to send ${type} notification email to: ${to}`);
    console.log(`Using sender email: ${process.env.EMAIL_USER}`);

    // Common email properties
    const from = `Auction Platform <${process.env.EMAIL_USER}>`;
    const commonFooter = `
      <p>Thank you,<br/>The Auction Platform Team</p>
    `;

    // Configure email content based on type
    let subject, html;
    
    if (type === 'winner') {
      // Winner notification email
      subject = `You won the auction for ${productName}!`;
      html = `
        <h2>Congratulations ${winnerName}!</h2>
        <p>You have won the auction for <strong>${productName}</strong> with your bid of $${bidAmount.toFixed(2)}.</p>
        
        <p>Please log in to the platform to complete your purchase.</p>
        ${commonFooter}
      `;
    } else {
      // Default bid notification email (existing functionality)
      subject = `New Bid: $${bidAmount.toFixed(2)} on ${productName}`;
      html = `
        <h2>New Bid on Your Product</h2>
        <p>A new bid has been placed on your product <strong>${productName}</strong>.</p>
        <p><strong>Bid Amount:</strong> $${bidAmount.toFixed(2)}</p>
        
        <p>Please log in to the platform to review the bid.</p>
        ${commonFooter}
      `;
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
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

// Preserve existing exports
module.exports = { sendNotificationEmail };