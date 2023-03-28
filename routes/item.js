const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/item');
const cloudinary = require('cloudinary').v2;
const path = require('path');


// Configuration 
cloudinary.config({
  cloud_name: "drdvbbr1d",
  api_key: "848374464672151",
  api_secret: "4Vxmnt7bITpi-trjT2HOT_Ju_0E"
});

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


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

  // Handle POST requests to upload an imagee
router.post('/', upload.single('image'), function(req, res) {
  // Get the path to the uploaded file
  const imagePath = req.file.path;

  // Upload the image to Cloudinary
  cloudinary.uploader.upload(imagePath, function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(result);

    // Create a new item with the uploaded image URL
    const newItem = new Item({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      Address: req.body.Address,
      City: req.body.City,
      State: req.body.State,
      title: req.body.title,
      description: req.body.description,
      phone: req.body.phone,
      type: req.body.type,
      image: result.url
    });

    // Save the new item to the database
    newItem.save()
    .then(() => {
      res.redirect('/listing-layout-2.html');
    })
    .catch((error) => {
      console.log(error);
      // handle errorr
    });
  });
});

module.exports = router;