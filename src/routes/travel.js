const express = require('express');
const router = express.Router();
const Travel = require('../models/Travel.model');


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
    const travel = new Travel(req.body)
    travel.save().then( newTravel => {
        return res.status(201).json(newTravel)
    }).catch(err=>{ res.status(500).json(err) })
})

// Update an existing travel
router.put('/travel', (req, res) => {
  if(!req.body){
      return res.status(400).send('Request body is missing')
  }
  const travel = new Travel(req.body)
  Travel.findByIdAndUpdate(travel._id, travel, {new: true}).then( newTravel => {
      res.status(205).json(newTravel)
  }).catch( err => res.status(500).json(err))
})

// Delete an existing travel
router.delete('/travel', (req, res) => {
  if(!req.body){
    return res.status(400).send('Request body is missing')
  }
  const travel = new Travel(req.body)
  Travel.findByIdAndRemove(travel._id).then(removedTravel => {
    res.status(202).json(removedTravel)
  }).catch( err => res.status(500).json(err))
})


module.exports = router;
