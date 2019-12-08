let mongoose = require('mongoose');


let bikeSchema = new mongoose.Schema({
    name: String,
    model: String,
    image: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created: {type:Date,default:Date.now}

});
module.exports = mongoose.model('Bike', bikeSchema);