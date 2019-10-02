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
const methodOverride = require('method-override');

const app = express();

// routing and connection to database and image uploader file requiring
const book = require('./routes/books');
const sport = require('./routes/sports');
const connectDB = require('./config/connect');
const upload = require('./handlers/multer');
const {
    ensureAuthenticated
} = require('./helper/auth');
require('./handlers/cloudinary');

// connection to database
connectDB();

// BookSchema
require('./models/Books');
const Book = mongoose.model('books');

// SportSchema
require('./models/Sports');
const Sport = mongoose.model('sports');

// UserSchema
require('./models/Users');
const User = mongoose.model('users');

// passport file (serializer, deserializer and password comparisions)
require('./config/passport')(passport);

// helper functions
const {search, formatDate, Icon, select} = require('./helper/hbs');

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

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Middleware handlebars
app.engine('handlebars', exphbs({
    helpers: {
        search: search,
        formatDate: formatDate,
        Icon: Icon,
        select: select
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// to use static files
app.use(express.static('public'));

// for accessing sended inputs
app.use(bodyParser.urlencoded({
    extended: true
}));

// @Access  public
// @route   get /
// @desc    get landing page
app.get('/', (req, res) => {
    res.render('index/index');
});

// @Access  public
// @route   get /login
// @desc    get login page for users
app.get('/login', (req, res) => {
    res.render('users/login');
});

// @Access  public
// @route   get /register
// @desc    get register page for newusers
app.get('/register', (req, res) => {
    res.render('users/register');
});

app.get('/forgot', (req, res)=> {
    res.render('users/secret');
})

// @Access  public
// @route   post /register
// @desc    register users
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

// @Access  public
// @route   post /login
// @desc    finding of user and matching password using passport
app.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
})

// @Access  private
// @route   get /cart
// @desc    details of what you selled
app.get('/cart', ensureAuthenticated, (req, res)=> {
    Book.find({user: req.user.id})
    .then(books => {
        Sport.find({user: req.user.id})
        .then(sports => {
            res.render('index/cart', {books: books, sports: sports});
        })
    })
})

// @Access  private
// @route   get /profile
// @desc    loggedIn user details
app.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({_id: req.user.id})
    .then(user => {
        res.render('index/profile', {user: user});
    })
})

// @Access  private
// @route   get /logout
// @desc    logout user
app.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

// all routes starting with /books or /sports will redirected
app.use('/books', book);
app.use('/sports', sport);

// app listening address
const port = process.env.PORT || 4000;
app.listen(port, (req, res) => {
    console.log(`Server is Running at ${port}`);
})