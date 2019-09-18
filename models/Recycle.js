const mongoose = require('mongoose');

// Recycle schema
const recycleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    quantity: {
        type: Number,
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

mongoose.model('recycles', recycleSchema);