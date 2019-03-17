const mongoose = require('mongoose')
const db = require('./dbConnectionString')

//const connectionString = 'mongodb+srv://footprint:footprint@cluster-footprint-uglmu.gcp.mongodb.net/footprint_Canada?retryWrites=true'
mongoose.connect(db.db_Canada)

let travelSchema = new mongoose.Schema({
    userId: String,
    cityId: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    travelType: String,
    cost: { type: Number, default: 0 },
    score: { type: Number, min: 1, max: 5, default: 3 },
    footprints: [{}]
})

module.exports = mongoose.model('Travel', travelSchema, 'travels')