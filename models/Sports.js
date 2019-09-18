const mongoose = require('mongoose');

// Sport schema
const sportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    used: {
        type: Number,
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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

mongoose.model('sports', sportSchema);