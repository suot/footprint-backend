const express = require('express');
const router = express.Router();
const Travel = require('../models/Travel.model');
const City = require('../models/City.model');
const mongoose = require('mongoose');
const sampleCities = require('../warehouse/sampleCities.json');
const config = require('../models/config');


//administrative account for inserting or deleting records
const userId = config.admin;

const gen = require('random-seed');
getRandomNumber = (n, min, max) => {
    let seed = n + "" + new Date().getSeconds();
    return gen(seed).intBetween(min, max);
};

//start = "2018-01-01", end="2019-03-31"
getRandomDate = (n, start, end) => {
    start = new Date(start);
    end = new Date(end);
    let seed = n + "" + new Date().getSeconds();
    return new Date(start.getTime() + gen(seed).floatBetween(0, 1) * (end.getTime() - start.getTime()))
};

getRandomEndDate = (n, startDate) => {
    let seed = n + "" + new Date().getSeconds();
    return new Date(startDate.getTime() + gen(seed).intBetween(1, 30) * 3600*12*1000);
};

//Insert sample date into DB
// localhost:3001/warehouse/sampleTravels?amount=100
router.get('/sampleTravels/add', function(req, res) {
    if(!req.query.amount || req.query.amount === 0){
        return res.status(400).send('Request parameter is missing')
    }else{
        const amount = req.query.amount;
        addTravelsRecursively(res, 0, amount);
    }
});

//for loop is not used here as all the mongoose operations are asynchronous functions, but we need to insert records one by one.
addTravelsRecursively = (res, n, amount) => {
    if(n++ < amount){
        const length = sampleCities.length;
        let startDate, endDate, rating, cost, i, j, city, type, latlng;

        startDate = getRandomDate(n, "2018-01-01", "2019-03-31");
        endDate = getRandomEndDate(n, startDate);
        rating = getRandomNumber(n, 1, 5);
        cost = getRandomNumber(n, 100, 10000);

        //i is a random index of sampleCities and j is a random index of types in one city
        i = getRandomNumber(n, 0, length-1);
        city = sampleCities[i];
        //to make it better distributed
        j = getRandomNumber(n+""+cost, 0, city.types.length-1);
        type = city.types[j];
        latlng = {
            lat: city.lat,
            lng: city.lng
        };

        City.findOne({ country: city.country, name: city.name }).then( doc => {
            if(!doc || doc.length === 0){
                //insert a new city into db
                let cityModel = new City({
                    _id: new mongoose.Types.ObjectId(),
                    country: city.country,
                    name: city.name,
                    latlng: latlng,
                    visitedTimes: 1,
                    score: rating,
                });

                //retrieve the _id of the new inserted city
                cityModel.save().then( newCity => {
                    insertIntoTravels(res, n, amount, userId, newCity._id, startDate, endDate, type, cost, rating);
                }).catch(err => res.status(500).json(err))
            }else{
                //update an existing city
                doc.updateOne({visitedTimes: doc.visitedTimes + 1, score: doc.score + rating}).then(() => {
                    insertIntoTravels(res, n, amount, userId, doc._id, startDate, endDate, type, cost, rating);
                }).catch(err => res.status(500).json(err))
            }
        }).catch( err => res.status(500).json(err))
    }else{
        res.status(200).send("Add sample data to source db successfully!");
    }
};

insertIntoTravels = (res, n, amount, userId, cityId, startDate, endDate, type, cost, rating) => {
    let travelModel = new Travel({
        userId: userId,
        city: cityId,
        startDate: startDate,
        endDate: endDate,
        travelType: type,
        cost: cost,
        rating: rating,
    });

    travelModel.save().then( () => {
        console.log("Number of records saved: "+n);
        addTravelsRecursively(res, n, amount);
    }).catch( err => res.status(500).json(err))
};


// Delete sample data
router.delete('/warehouse/sampleTravels', (req, res) => {
    Travel.find({userId: userId}).then(travels => {
        deleteTravelRecursively(res, 1, travels);
    }).catch( () => res.status(500))
});

deleteTravelRecursively = (res, n, travels) => {
    if(n <= travels.length){
        let travel = travels[n-1];

        travel.remove().then(()=>{
            updateCity(res, n, travels);
        }).catch(()=>{ res.status(500) })
    }else{
        res.status(202).send("Delete sample data from source database successfully!");
    }
};

updateCity = (res, n, travels) => {
    City.findById(travels[n-1].city).then( doc => {
        if(!doc || doc.length === 0){
            res.status(500)
        }else{
            if( doc.visitedTimes === 1){
                doc.remove().then(()=>{deleteTravelRecursively(res, ++n, travels);}).catch( () => { res.status(500) })
            }else{
                doc.updateOne({visitedTimes: doc.visitedTimes - 1, score: doc.score - travels[n-1].rating}).then(()=>{deleteTravelRecursively(res, ++n, travels);}).catch( () => { res.status(500) })
            }
        }
    }).catch( () => { res.status(500) })
};

module.exports = router;
