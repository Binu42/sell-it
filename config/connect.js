const mongoose = require('mongoose');
const keys = require('./keys');

// connecting to database
const connectDB = () => {

    mongoose.connect(keys.mongoDBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('connected to Database');
        })
        .catch(error => {
            console.log(error.array);
        })
}

module.exports = connectDB