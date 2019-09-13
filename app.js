// Dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');


const app = express();

const book = require('./routes/books');
const sport = require('./routes/sports');
const connectDB = require('./config/connect');
const upload = require('./handlers/multer');
require('./handlers/cloudinary');
connectDB();


require('./models/Users');
const User = mongoose.model('users');
require('./config/passport')(passport);

// To save session as cookies
app.use(session({
    secret: 'Hello world',
    resave: false,
    saveUninitialized: false
}))

// This passport middleware must be below express session 
app.use(passport.initialize());
app.use(passport.session());

// To show Flash pop up on edit delete ....
app.use(flash());

// Global variables for flash and setting navbar
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index/index');
});

app.get('/login', (req, res) => {
    res.render('users/login');
});

app.get('/register', (req, res) => {
    res.render('users/register');
});

app.post('/register', upload.single('profile_pic'), (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(async user => {
            if (user) {
                req.flash('error_msg', "Email already Registered! Try another...");
                res.redirect('/register');
            } else {
                // uploading image uploaded to cloud
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    width: 250,
                    height: 250,
                    gravity: "faces",
                    crop: "fill"
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.location,
                    contact: req.body.mobileno,
                    profile: result.secure_url,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        else {
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "You are now registered  login now!");
                                    res.redirect('/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        }
                    })
                })
            }
        })
});

// route for login of user
app.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
})

// route for logout of user
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

app.use('/books', book);
app.use('/sports', sport);

const port = process.env.PORT || 4000;
app.listen(port, (req, res) => {
    console.log(`Server is Running at ${port}`);
})