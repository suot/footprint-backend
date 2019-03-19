const mongoose = require('mongoose')
const db = require('./dbConnectionString')

mongoose.connect(db.db_Canada, { useNewUrlParser: true })

let travelSchema = new mongoose.Schema({
    userId: String,
    cityId: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    travelType: String,
    cost: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    footprints: [{}]
})

module.exports = mongoose.model('Travel', travelSchema, 'travels')