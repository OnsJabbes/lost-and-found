const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require("cors");

let ejs = require ('ejs') ;



const itemRoute = require('./routes/item');
const userRoute = require ('./routes/users') ; 

// let auth  = (req,res,next)=>{
//   if(req.user){
//     return next 
//   }
//   return res.redirect('login')
// }
//app.use(auth)

const app = express();
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true  
  })
);
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(itemRoute);
app.use(userRoute) ; 

app.set('views',__dirname + '/public/themes/listdo-html/Sliding-Sign-In-Sign-Up-Form-master/');
app.engine('html', require('ejs').renderFile);


// Express session

//variable globale 
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


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

