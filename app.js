// Core Module
const path = require('path');

// External Modules
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require('./routes/authRouter');
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

const DB_PATH = "mongodb+srv://shabi1537:Shabi%401537@shabi.u528nis.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Shabi";
const PORT = 3001;

// Session Store Setup
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions',
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'airbnb secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

// Make session info available in requests
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// Routers
app.use(authRouter);
app.use(storeRouter);

app.use('/host', (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use('/host', hostRouter);

// 404 Controller
app.use(errorsController.pageNotFound);

// MongoDB Connection and Server Start
mongoose.connect(DB_PATH)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
