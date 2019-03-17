const mongoose = require('mongoose')
const db = require('./dbConnectionString')

//const connectionString = 'mongodb+srv://footprint:footprint@cluster-footprint-uglmu.gcp.mongodb.net/footprint_Canada?retryWrites=true'
mongoose.connect(db.db_Canada)


let citySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    visitedTimes: {
        type: Number,
        default: 1
    },
    score: {
        type: Number,
        default: 3
    },
});

module.exports = mongoose.model('City', citySchema, 'cities');