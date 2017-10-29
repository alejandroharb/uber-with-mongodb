const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//fix mongoose depracation warning regarding promises in mongoose
mongoose.Promise = global.Promise;

//differentiate between development vs test environment
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/muber', {
        useMongoClient: true
    });
}

//middleware for incoming requests
app.use(bodyParser.json());
routes(app);

//middleware for error handling
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});

module.exports = app;