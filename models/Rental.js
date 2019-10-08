const mongoose = require('mongoose');

// Rental Schema
const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    address: {
        type: String
    }
})


mongoose.model('rentals', rentalSchema);
