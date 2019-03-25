const City = require('../models/City.model');
const express = require('express');
const router = express.Router();


// Create a new city or update an existing city with increased visitedTime and score
// router.post('/city', (req, res) => {
//     //req.body
//     if(!req.body){
//         return res.status(400).send('Request body is missing')
//     }
//
//     let model = new City(req.body)
//
//     City.findOne({ country: model.country, name: model.name }).then( doc => {
//         if(!doc || doc.length === 0){
//             //insert a new row
//             model.save().then( newCity => {
//                 return res.status(201).json(newCity)
//             }).catch(err=>{ res.status(500).json(err) })
//         }else{
//             //update an existing row
//             doc.updateOne({visitedTimes: doc.visitedTimes+1, score: doc.score + model.score}, {new: true}).then(newCity => {
//                 return res.status(205).json(newCity)
//             }).catch(err=>{ res.status(500).json(err) })
//         }
//     }).catch( err => res.status(500).json(err))
// })


// // Update a city with decreased visitedTime and score
// router.post('/city/decrease', (req, res) => {
//     //req.body
//     if(!req.body){
//         return res.status(400).send('Request body is missing')
//     }
//
//     let model = new City(req.body)
//
//     City.findOne({ country: model.country, name: model.name }).then( doc => {
//         if(!doc || doc.length === 0){
//             return res.status(204).send("Could not find this city in Database: " + model.name + ", " + model.country)
//         }else{
//             if( doc.visitedTimes === 1){
//                 //remove
//                 doc.remove().then( removedCity => {
//                     return res.status(202).json(removedCity)
//                 }).catch(err=>{ res.status(500).json(err) })
//             }else{
//                 //update
//                 doc.updateOne({visitedTimes: doc.visitedTimes-1, score: doc.score - model.score}, {new: true}).then(newCity => {
//                     return res.status(205).json(newCity)
//                 }).catch(err=>{ res.status(500).json(err) })
//             }
//         }
//     }).catch( err => res.status(500).json(err))
// })

module.exports = router;