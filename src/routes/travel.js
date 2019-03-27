const express = require('express');
const router = express.Router();
const Travel = require('../models/Travel.model');
const City = require('../models/City.model');
const mongoose = require('mongoose')


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
        Travel.find({ userId: userId }).populate('city').then( doc => {
            return res.status(200).json(doc)
        }).catch( err => res.status(500).json(err))
    }else{
        res.send('You have not included a userId in your request');
    }
});


// Create a new travel
router.post('/travel', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }
    const travel = req.body.travel;
    const travelCity = travel.city;
    const userId = req.body.userId;

    City.findOne({ country: travelCity.country, name: travelCity.name }).then( doc => {
        if(!doc || doc.length === 0){
            //insert a new city into db
            let cityModel = new City({
                _id: new mongoose.Types.ObjectId(),
                country: travelCity.country,
                name: travelCity.name,
                latlng: travelCity.latlng,
                visitedTimes: 1,
                score: travel.rating,
            })
            //retrieve the _id of the new inserted city
            cityModel.save().then( newCity => {
                //insert a new travel record to the travels collection in DB
                insertTravelRecord(res, userId, newCity._id, travel);
            }).catch(err => res.status(500).json(err))
        }else{
            //update an existing city
            doc.updateOne({visitedTimes: doc.visitedTimes + 1, score: doc.score + travel.rating}, {new: true}).then(newCity => {
                insertTravelRecord(res, userId, newCity._id, travel);
            }).catch(err => res.status(500).json(err))
        }
    }).catch( err => res.status(500).json(err))
})

insertTravelRecord = (res, userId, cityId, travel) => {
    const travelModel = new Travel({
        userId: userId,
        city: cityId,
        startDate: travel.startDate,
        endDate: travel.endDate,
        travelType: travel.travelType,
        cost: travel.cost,
        rating: travel.rating,
        footprints: travel.footprints
    })
    travelModel.save().then( newTravel => { return res.status(201).json(newTravel) }).catch(err=>{ return res.status(500).json(err) })
}


// Delete an existing travel
router.delete('/travel', (req, res) => {
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }
    const _id = req.query._id;
    Travel.findByIdAndRemove(_id).then(removedTravel => {
        //update the city's score, or delete it if its visitedTime is 1.
        updateCityAfterTravelRemoved(res, removedTravel);
    }).catch( err => res.status(500).json(err))
})

updateCityAfterTravelRemoved = (res, removedTravel) => {
    City.findById(removedTravel.city).then( doc => {
        if(!doc || doc.length === 0){
            return res.status(500).send('No city visited in this travel is found')
        }else{
            if( doc.visitedTimes === 1){
                //remove
                doc.remove().then( removedCity => {
                    res.status(202).json(removedTravel)
                }).catch(err=>{ res.status(500).json(err) })
            }else{
                //update
                doc.updateOne({visitedTimes: doc.visitedTimes - 1, score: doc.score - removedTravel.rating}, {new: true}).then(newCity => {
                    res.status(202).json(removedTravel)
                }).catch(err=>{ res.status(500).json(err) })
            }
        }
    }).catch( err => { res.status(500).json(err) })
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
