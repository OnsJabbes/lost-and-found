const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const itemRoute = require('./routes/item');

// create express app
const app = express();
app.use (cors()) ; 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'));
app.use('/', itemRoute);



// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://ons:24102001@cluster0.2izjmij.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));






//---------link the template with server----------//
app.use('/', function (req, res, next) {
  res.sendFile(__dirname + '/public/themes/listdo-html/' + req.path);
});
//---------fin link the template with server---------//

app.listen(5000, () => {
  console.log('Server started on port 5000');
});