const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(
  'mongodb+srv://mayssa:mayssa@cluster0.ckpide7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
const LocalisationSchema = {

  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }

}
const Localisation = mongoose.model('Localisation', LocalisationSchema);

module.exports = Localisation;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/themes/listdo-html/add-listing.html');
});


app.post('/', function (req, res) {
  let newLocalisation = new Localisation({
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  newLocalisation.save();
});


app.listen(5000, () => {
  console.log('Server started on port 5000');
});





//links
app.use('/', function (req, res, next) {
  res.sendFile(__dirname + '/public/themes/listdo-html/' + req.path);
});


