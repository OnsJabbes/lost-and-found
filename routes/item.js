const express = require('express');
const router = express.Router();
module.exports = (app) => {
    
    const items = require('../controllers/item.controller');

    app.post('/', items.create);

    
    app.get('/items', itemss.findAll);

   
   
}