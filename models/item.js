const mongoose = require('mongoose');
const ItemSchema = {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      
    },
    type: {
      type: String,
      required:true,
    },
    description: {
      type: String,
      required:true,
    },
    phone: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    Address: {
      type: String,
      required:true,
    },
    State: {
      type: String,
      required:true,
    },
    City: {
      type: String,
      required:true,
    },
    image: {
      type: String,
      required:true,
    },
    
  
  }
  const Item = mongoose.model('Item', ItemSchema);
  
  module.exports = Item;