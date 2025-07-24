const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// ✅ Webhook verification route
router.get('/webhook', (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ Incoming messages route
router.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const phoneNumber = message.from;
      const text = message.text?.body || '';

      console.log(`Message from ${phoneNumber}: ${text}`);

      // Auto reply
      await sendMessage(phoneNumber, 'Thanks for your message!');
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✅ Function to send message
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: text },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error('Error sending message:', error?.response?.data || error.message);
  }
}

module.exports = router;
