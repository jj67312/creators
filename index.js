const express = require('express');
const app = express();
const path = require('path');

// models
const Creator = require('./models/Creator');

// routes:
const userRoutes = require('./routes/creatorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

//ejs-mate package to make use of additional ejs functionalities like layout, partials etc
const ejsMate = require('ejs-mate');

//method-override package so that we can make use of put and delete
const methodOverride = require('method-override');

// express-session:
const session = require('express-session');

// flash
const flash = require('connect-flash');

// telling express that we will be using ejsMate instead of the default one
app.engine('ejs', ejsMate);

// Set EJS as templating engine
app.set('view engine', 'ejs');

/*
  __dirname represents the directory we are currently working in
  and views is the folder where all of our ejs templates will be kept
*/
app.set('views', path.join(__dirname, 'views'));

// to parse the data for post requests, or in other words:
// to access the data submited by a form to a post request
app.use(express.urlencoded({ extended: true }));

// query string value to override a method
app.use(methodOverride('_method'));

//for making use of custom css and js files in the public directory:
app.use(express.static(path.join(__dirname, 'public')));

// connecting to database using mongoose
const mongoose = require('mongoose');
main()
  .then((res) => {
    console.log('Successfully connected to mongoDB!');
  })
  .catch((err) => {
    console.log('Connection to mongoDB failed!');
  });
async function main() {
  await mongoose.connect('mongodb://localhost:27017/duckcartDB2');
}

// express-session settings
app.use(
  session({ secret: 'thisisasecret', saveUninitialized: true, resave: true })
);

// setting up flash:
app.use(flash());
let currentUser;
app.use(async (req, res, next) => {
  currentUser = await Creator.findById(req.session.user_id);
  next();
});

// Middleware for flash:
app.use(async (req, res, next) => {
  // console.log(req.query);
  res.locals.currentUser = currentUser;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes used:
app.use('/', userRoutes);
app.use('/payments', paymentRoutes);

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh No, something went wrong!';
  }
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Active on ${port}`);
});
