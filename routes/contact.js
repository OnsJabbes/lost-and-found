const express = require('express');
const router = express.Router();
const Contact  = require('../models/contact');
const path = require('path');
const mongoose = require('mongoose');

// Create operation
router.post('/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const contact = new Contact({ name, email, subject, message });
      await contact.save();
      res.redirect('back');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;  