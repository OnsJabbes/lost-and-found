const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const itemRoute = require('./routes/item');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', itemRoute);
// Use the express-fileupload middlewaree
app.use(fileUpload({
  useTempFiles:true
}));






// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://ons:24102001@cluster0.2izjmij.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });








//---------link the template with server----------//
app.use('/', function (req, res, next) {
  res.sendFile(__dirname + '/public/themes/listdo-html/' + req.path);
});
//---------fin link the template with server---------//

