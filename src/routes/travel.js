const express = require('express');
const router = express.Router();
const Travel = require('../models/Travel.model');
const City = require('../models/City.model');


// localhost:3000/footprint/abc
// router.get('/footprint/:uid', function(req, res) {
//   res.send(`You have requested a footprint ${req.params.uid}`);
// });

// localhost:3000/travel?uid=abc
router.get('/travel', function(req, res) {
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }
    const userId = req.query.userId
    if(userId){
        Travel.find({ userId: userId }).then( doc => {
            return res.status(200).json(doc)
        }).catch( err => res.status(500).json(err))
    }else{
        res.send('You have not include a uid in your request');
    }
});


// Create a new travel
router.post('/travel', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }
    const travelRecord = req.body.travelRecord;
    const travelCity = travelRecord.city;

    City.findOne({ country: travelCity.country, name: travelCity.name }).then( doc => {
        if(!doc || doc.length === 0){
            //insert a new city into db
            let cityModel = new City({
                country: travelCity.country,
                name: travelCity.name,
                lat: travelCity.lat,
                lng: travelCity.lng,
                visitedTimes: 1,
                score: travelRecord.rating,
            })
            //retrieve the _id of the new inserted city
            cityModel.save().then( newCity => {
                //insert a new travel record to the travels collection in DB
                insertTravelRecord(res, req.body.uid, newCity._id, travelRecord);
            }).catch(err => res.status(500).json(err))
        }else{
            //update an existing city
            doc.updateOne({visitedTimes: doc.visitedTimes + 1, score: doc.score + travelRecord.rating}, {new: true}).then(newCity => {
                insertTravelRecord(res, req.body.uid, newCity._id, travelRecord);
            }).catch(err => res.status(500).json(err))
        }
    }).catch( err => res.status(500).json(err))
})

insertTravelRecord = (res, uid, cityId, travelRecord) => {
    const travelModel = new Travel({
        userId: uid,
        cityId: cityId,
        startDate: travelRecord.startDate,
        endDate: travelRecord.endDate,
        travelType: travelRecord.travelType,
        cost: travelRecord.cost,
        rating: travelRecord.rating,
        footprints: travelRecord.footprints
    })
    travelModel.save().then( newTravel => { return res.status(201).json(newTravel) }).catch(err=>{ return res.status(500).json(err) })
}


// Delete an existing travel
router.delete('/travel', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }
    const _id = req.body._id;
    const rating = req.body.rating;

    //update the city's score, or delete the city if its visitedTime is 1.
    City.findById(_id).then( doc => {
        if(!doc || doc.length === 0){
            return res.status(500).send('No city visited in this travel is found')
        }else{
            if( doc.visitedTimes === 1){
                //remove
                doc.remove().then( removedCity => {
                    deleteTravelRecord(res, _id);
                }).catch(err=>{ res.status(500).json(err) })
            }else{
                //update
                doc.updateOne({visitedTimes: doc.visitedTimes - 1, score: doc.score - rating}, {new: true}).then(newCity => {
                    deleteTravelRecord(res, _id);
                }).catch(err=>{ res.status(500).json(err) })
            }
        }
    }).catch( err => { res.status(500).json(err) })
})

deleteTravelRecord = (res, _id) => {
    Travel.findByIdAndRemove(_id).then(removedTravel => {
        res.status(202).json(removedTravel)
    }).catch( err => res.status(500).json(err))
}


// // Update an existing travel
// router.put('/travel', (req, res) => {
//     if(!req.body){
//         return res.status(400).send('Request body is missing')
//     }
//     const travel = new Travel(req.body)
//     Travel.findByIdAndUpdate(travel._id, travel, {new: true}).then( newTravel => {
//         res.status(205).json(newTravel)
//     }).catch( err => res.status(500).json(err))
// })

module.exports = router;
