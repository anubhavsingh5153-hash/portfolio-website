const express = require('express');
const router  = express.Router();
const { db }  = require('../db/connection');

function validateContact({ name, email, message }) {
  const errors = [];
  if (!name    || name.trim().length    < 2)  errors.push('Name must be at least 2 characters.');
  if (!email   || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  return errors;
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const errors = validateContact({ name, email, message });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const contact = db.contacts.insert({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject ? subject.trim() : null,
      message: message.trim()
    });

    console.log(`📧 New contact from ${contact.name} <${contact.email}> — ID: ${contact.id}`);

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      id: contact.id
    });
  } catch (err) {
    console.error('POST /api/contact error:', err);
    res.status(500).json({ success: false, error: 'Failed to save message. Please try again.' });
  }
});

module.exports = router;
