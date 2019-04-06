let mongoose = require('mongoose');
const db = require('./config');
mongoose.connect(db.db_Canada);

let travelSchema = new mongoose.Schema({
    userId: String,
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'City'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    travelType: String,
    cost: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    footprints: [],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Travel', travelSchema, 'travels');
