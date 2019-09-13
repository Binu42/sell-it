const mongoose = require('mongoose');
const keys = require('./keys');

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