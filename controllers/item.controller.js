const item = require('../models/item');


// Read data
exports.findAll= (req, res) => {
    Item.find({})
      .then(items => {
        res.json(items);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error reading items' });
      });
  };


//create and save new item 
exports.create=  (req, res) => {
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
     // Save item in the database
     newItem.save()
     .then(data => {
         res.send(data);
     }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while creating the admin."
         });
     });
    res.redirect('/listing-layout-2.html')
  };


  

  