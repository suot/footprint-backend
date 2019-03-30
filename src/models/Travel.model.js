const mongoose = require('mongoose')
const db = require('./dbConnectionString')
const Schema = mongoose.Schema;

mongoose.connect(db.db_Canada, { useNewUrlParser: true })

let travelSchema = new mongoose.Schema({
    userId: String,
    city: {
        type: Schema.Types.ObjectId,
        ref:'City'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    travelType: String,
    cost: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    footprints: [],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Travel', travelSchema, 'travels')