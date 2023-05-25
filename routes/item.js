const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/item');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const mongoose = require('mongoose');
const { title } = require('process');


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
      image: result.url , 
      category: req.body.category,
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




// Handle PUT requests to update an item
router.post('/items/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Find the item by ID
  Item.findById(id)
    .then(item => {
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Update the item with the new data
      item.latitude = req.body.latitude;
      item.longitude = req.body.longitude;
      item.Address = req.body.Address;
      item.City = req.body.City;
      item.State = req.body.State;
      item.title = req.body.title;
      item.description = req.body.description;
      item.phone = req.body.phone;
      item.type = req.body.type;
      item.category = req.body.category;


      // Upload the new image to Cloudinary if provided
      if (req.file) {
        const imagePath = req.file.path;
        cloudinary.uploader.upload(imagePath, function(err, result) {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          console.log(result);
          item.image = result.url;
          // Save the updated item to the database
          item.save()
            .then(() => {
              res.redirect('/dashboard-listing.html');
            })
            .catch((error) => {
              console.log(error);
              // handle error
            });
        });
      } else {
        // Save the updated item to the database
        item.save()
          .then(() => {
            res.redirect('/dashboard-listing.html');
          })
          .catch((error) => {
            console.log(error);
            // handle error
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error updating item' });
    });
});





// Handle DELETE requests to delete an item
router.post('/delete/:id', (req, res) => {
  
  
  const itemId = req.params.id;

  Item.findByIdAndDelete(itemId)
    .then(() => {
      res.redirect('back');
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error deleting item' });
    });
});

router.get('/items/:id', (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  Item.findOne({ _id: id })
    .then(item => {
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error reading item' });
    });
});




router.get('/search/lost', async (req, res) => {
  const category = req.query.category || 'All Categories';
  const title = req.query.title || '';
  const city = req.query.city || '';

  // Check if any of the search parameters are empty
  if (category === '' || title === '' || city === '') {
    // Redirect the user back to the error page with an error message
    const errorMessage = 'Please enter a value for all search fields.';
    res.redirect(`/error-page.html?error=${errorMessage}`);
    return;
  }

  try {
    const query = req.query.q ? req.query.q.toString() : '';
    const items = await Item.find({ 
      $and: [
        { title: { $regex: title, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
        { category: { $regex: category, $options: "i" } }
      ],
      type: "lost"
    });
    // Pass search parameters to the redirect URL
    
    res.render('../listing-layout-3.html',{items});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/search/found', async (req, res) => {
  const category = req.query.category || 'All Categories';
  const title = req.query.title || '';
  const city = req.query.city || '';

  // Check if any of the search parameters are empty
  if (category === '' || title === '' || city === '') {
    // Redirect the user back to the error page with an error message
    const errorMessage = 'Please enter a value for all search fields.';
    res.redirect(`/error-page.html?error=${errorMessage}`);
    return;
  }

  try {
    const query = req.query.q ? req.query.q.toString() : '';
    const items = await Item.find({ 
      $and: [
        { title: { $regex: title, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
        { category: { $regex: category, $options: "i" } }
      ],
      type: "found"
    });
    // Pass search parameters to the redirect URL
    
    res.render('../listing-layout-3.html',{items});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/search', async (req, res) => {
  const category = req.query.category || 'All Categories';
  const title = req.query.title || '';
  const city = req.query.city || '';

  // Check if any of the search parameters are empty
  if (category === '' || title === '' || city === '') {
    // Redirect the user back to the error page with an error message
    const errorMessage = 'Please enter a value for all search fields.';
    res.redirect(`/error-page.html?error=${errorMessage}`);
    return;
  }

  try {
    const query = req.query.q ? req.query.q.toString() : '';
    const items = await Item.find({ 
      $and: [
        { title: { $regex: title, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
        { category: { $regex: category, $options: "i" } } , 
        { type: { $regex: title , $options: "i" } }
      ],
      
    });
    // Pass search parameters to the redirect URL
    
    res.render('../listing-layout-3.html',{items});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
