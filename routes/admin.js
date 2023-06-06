const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/User');
const path = require('path');
const mongoose = require('mongoose');

router.get('/itemtable', (req, res) => {

    Item.find({ })
      .then(items => {
        if (items.length === 0) {
          return res.status(404).redirect("../error-page.html");
        }
        res.render('../table-item.html',{ items });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error reading items' });
      });
    
      
      
  });


  router.get('/usertable', (req, res) => {

    

    User.find({ })
        .then(users => {
        if (users.length === 0) {
          return res.status(404).redirect("../error-page.html");
        }
        res.render('../table-user.html',{ users });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error reading items' });
      });


      
      
  });
  module.exports = router;