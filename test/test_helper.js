//if we are running mocha test, then this file has been run,
//so no need to place an if() statement to check NODE_ENV

const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/muber_test', {
        useMongoClient:true
    });
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', error);
        });
});

beforeEach( done => {
    const { drivers } = mongoose.connection.collections;
    drivers.drop()
        .then( () => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
        .then( () => done())
        .catch( () => done());
})