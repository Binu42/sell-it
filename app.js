// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


const app = express();

const book = require('./routes/books');
const sport = require('./routes/sports');

// Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', (req, res)=> {
    res.render('index/index');
});

app.get('/login', (req, res)=> {
    res.render('users/login');
})

app.get('/register', (req, res)=> {
    res.render('users/register');
})

app.use('/books', book);
app.use('/sports', sport);

const port = process.env.PORT || 4000;
app.listen(port, (req, res) => {
    console.log(`Server is Running at ${port}`);
})

