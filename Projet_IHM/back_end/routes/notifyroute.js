const express = require("express");
const router = express.Router();
const { sendNotificationEmail } = require("../services/emailService");

// Change from "/api/notify" to just "/"
router.post("/", async (req, res) => {
  try {
    const { productName, productId, bidAmount, ownerEmail } = req.body;

    if (!productName || !ownerEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendNotificationEmail({
      productName,
      productId,
      bidAmount,
      ownerEmail,
    });

    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Also change the GET endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Notification endpoint is working",
    usage:
      "Send POST request with {productName, productId, bidAmount, ownerEmail}",
  });
});

module.exports = router;
