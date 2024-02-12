const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {    
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { collection: 'userDetails' });

mongoose.model('UserDetail', userDetailSchema);