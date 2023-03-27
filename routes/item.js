const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Read data
router.get('/items', (req, res) => {
  Item.find({})
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error reading items' });
    });
});


router.post('/', function (req, res) {
    let newItem = new Item({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      Address:req.body.Address,
      City:req.body.City,
      State:req.body.State,
      title: req.body.title,
      description: req.body.description,
      phone:req.body.phone,
      type:req.body.type,
      image:req.body.image
    });
    newItem.save();
    res.redirect('/listing-layout-2.html')
  });
  module.exports = router;