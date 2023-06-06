const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false,
    
  },
  
  phone: {
    type: Number,
    required: false,
  },
  
  image: {
    type: String,
    required:false,
  }, 

  createdAt: {
    type: Date,
    default: Date.now
  },

  isActive : {
    type : Boolean , 
    default : false , 
  }, 


  userId : String ,

  activationCode : String , 

  code : String , 
   
  expiresAt : Date ,

  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;