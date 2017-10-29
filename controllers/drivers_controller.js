const Driver = require('../models/driver');

module.exports = {
    
    greeting(req, res) {
        res.send({ hi: 'there' });
    },

    index(req, res, next) {
        const { lng, lat } = req.query; //query is where url data is stored for query variables (http://google.com?lng=80&lat=90)
        //geoNear is option via mongodb
        Driver.geoNear(
            { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            { spherical: true, maxDistance: 200000 } 
        )
            .then(drivers => res.send(drivers))
            .catch(next);
    },

    create(req, res, next) {
        const driverProps = req.body;

        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next); //next callback used to move to next middleware in the chain
    },

    edit(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
            .then(() => Driver.findById({ _id: driverId}))
            .then(driver => res.send(driver))
            .catch(next);
    },

    delete(req, res, next) {
        const driverId = req.params.id;

        Driver.findByIdAndRemove({ _id: driverId })
            .then((driver) => res.status(204).send(driver))
            .catch(next);
    }
};