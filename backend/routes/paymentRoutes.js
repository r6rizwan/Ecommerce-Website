const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const PAYMENT_PROVIDER = (process.env.PAYMENT_PROVIDER || "razorpay").toLowerCase();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_MAX_AMOUNT_PAISE = Number(process.env.RAZORPAY_MAX_AMOUNT_PAISE || 50000000);

const queryAsync = (conn, sql, params = []) =>
  new Promise((resolve, reject) => {
    conn.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const toPaise = (rupees) => Math.round(Number(rupees || 0) * 100);

const buildOrderGroupId = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const datePart = `${yyyy}${mm}${dd}`;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";

  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }

  return `ORD-${datePart}-${suffix}`;
};

const persistSuccessfulPayment = async ({ conn, uid, amountRupees, paymentReference, providerOrderId = null }) => {
  const paymentOrderId = Date.now();
  const orderGroupId = buildOrderGroupId();

  const sqlInsertPayment = `
    INSERT INTO payment (user_id, order_id, payment_reference, amount, payment_date)
    VALUES (?, ?, ?, ?, NOW())
  `;
  await queryAsync(conn, sqlInsertPayment, [
    uid,
    paymentOrderId,
    paymentReference || providerOrderId || `PAY_${paymentOrderId}`,
    amountRupees,
  ]);

  const sqlUpdateOrdersWithGroup = `
    UPDATE customerOrders
    SET order_status = 'Confirmed', payment_status = 'Paid', order_group_id = ?
    WHERE user_id = ? AND order_status = 'Pending'
  `;

  try {
    await queryAsync(conn, sqlUpdateOrdersWithGroup, [orderGroupId, uid]);
  } catch (err) {
    if (err.code !== "ER_BAD_FIELD_ERROR") throw err;

    const sqlUpdateOrdersFallback = `
      UPDATE customerOrders
      SET order_status = 'Confirmed', payment_status = 'Paid'
      WHERE user_id = ? AND order_status = 'Pending'
    `;
    await queryAsync(conn, sqlUpdateOrdersFallback, [uid]);
  }

  return orderGroupId;
};

router.post("/api/payment/create-order", async (req, res) => {
  const conn = req.app.get("db");
  const { uid, amount } = req.body || {};
  const amountPaise = toPaise(amount);

  if (!uid) {
    return res.status(400).json({ success: false, message: "Missing user id" });
  }

  if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  if (amountPaise > RAZORPAY_MAX_AMOUNT_PAISE) {
    return res.status(400).json({
      success: false,
      message: "Amount exceeds configured payment limit",
      maxAmountPaise: RAZORPAY_MAX_AMOUNT_PAISE,
    });
  }

  if (PAYMENT_PROVIDER === "mock") {
    return res.status(200).json({
      success: true,
      provider: "mock",
      order: {
        id: `mock_order_${Date.now()}`,
        amount: amountPaise,
        currency: "INR",
      },
    });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Razorpay keys are missing on backend",
    });
  }

  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_${uid}_${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.error?.description || "Failed to create Razorpay order",
      });
    }

    return res.status(200).json({
      success: true,
      provider: "razorpay",
      order: data,
    });
  } catch (err) {
    console.error("Razorpay order create failed:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
});

router.post("/api/payment/verify", async (req, res) => {
  const conn = req.app.get("db");
  const {
    uid,
    amount,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body || {};

  if (!uid) {
    return res.status(400).json({ success: false, message: "Missing user id" });
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    if (PAYMENT_PROVIDER === "razorpay") {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Missing Razorpay payment fields" });
      }

      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(payload)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment signature verification failed" });
      }
    }

    const paymentReference = razorpay_payment_id || `mock_payment_${Date.now()}`;
    const orderGroupId = await persistSuccessfulPayment({
      conn,
      uid,
      amountRupees: amount,
      paymentReference,
      providerOrderId: razorpay_order_id || null,
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order_group_id: orderGroupId,
    });
  } catch (err) {
    console.error("Payment verification/persist failed:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

// Legacy route kept for backward compatibility
router.post("/api/paybill/:razorpay_id/:price", async (req, res) => {
  const conn = req.app.get("db");
  const { razorpay_id, price } = req.params;
  const { uid } = req.body || {};

  if (!uid) {
    return res.status(400).json({ success: false, message: "Missing user id" });
  }

  try {
    const orderGroupId = await persistSuccessfulPayment({
      conn,
      uid,
      amountRupees: price,
      paymentReference: razorpay_id,
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order_group_id: orderGroupId,
    });
  } catch (err) {
    console.error("Legacy paybill failed:", err);
    return res.status(500).json({ success: false, message: "Order update failed" });
  }
});

module.exports = router;
