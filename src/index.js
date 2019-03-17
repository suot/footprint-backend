const express = require('express');
const path = require('path');
const travelRoute = require('./routes/travel');
const cityRoute = require('./routes/city');
const bodyParser = require('body-parser');

const app = express();
//some cloud servers may use the process.env.PORT
const PORT = process.env.PORT || 3000
//jsonString => json
app.use(bodyParser.json());

app.use(travelRoute);
app.use(cityRoute);
app.use(express.static('public'))


//next(): execute functions in pipeline
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`)
    next()
})

//Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send('We think you are lost!')
})

//Handler for 500 - Resource Not Found
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.sendFile(path.join(__dirname, '../public/500.html'))
})


app.listen(PORT, () => console.info(`Server has started on ${PORT}`))


