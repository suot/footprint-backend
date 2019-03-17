const City = require('../models/City.model');
const express = require('express');
const router = express.Router();


// Create a new city or update an existing city with increased visitedTime and score
// Post localhost:3000/city with a City model
router.post('/city', (req, res) => {
    //req.body
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }

    let model = new City(req.body)

    City.findOne({ country: model.country, city: model.city }).then( doc => {
        if(!doc || doc.length === 0){
            //insert a new row
            model.save().then( newCity => {
                return res.status(201).send(newCity)
            }).catch(err=>{ res.status(500).json(err) })
        }else{
            //update an existing row
            doc.updateOne({visitedTimes: doc.visitedTimes+1, score: doc.score + model.score}).then(originalCity => {
                return res.status(205).send(originalCity)
            }).catch(err=>{ res.status(500).json(err) })
        }
    }).catch( err => res.status(500).json(err))
})


// Update a city with decreased visitedTime and score
// Post localhost:3000/city with a City model
router.post('/city/decrease', (req, res) => {
    //req.body
    if(!req.body){
        return res.status(400).send('Request body is missing')
    }

    let model = new City(req.body)

    City.findOne({ country: model.country, city: model.city }).then( doc => {
        if(!doc || doc.length === 0){
            return res.status(204).send("Could not find this city in Database: " + model.city + ", " + model.country)
        }else{
            if( doc.visitedTimes === 1){
                //remove that row
                doc.remove().then( removedCity => {
                    return res.status(202).send(removedCity)
                }).catch(err=>{ res.status(500).json(err) })
            }else{
                //update that row
                doc.updateOne({visitedTimes: doc.visitedTimes-1, score: doc.score - model.score}).then(originalCity => {
                    return res.status(205).send(originalCity)
                }).catch(err=>{ res.status(500).json(err) })
            }
        }
    }).catch( err => res.status(500).json(err))
})

module.exports = router;