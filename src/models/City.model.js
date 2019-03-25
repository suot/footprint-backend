const mongoose = require('mongoose')
const db = require('./dbConnectionString')

mongoose.connect(db.db_Canada, { useNewUrlParser: true })


let citySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lat:{
        type: Number,
        required: true,
    },
    lng:{
        type: Number,
        required: true,
    },
    visitedTimes: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('City', citySchema, 'cities');