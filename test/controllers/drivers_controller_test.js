const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
// importing our model via mongoose because mocha attempts to require the model twice if you require in the model via the file, throwing error
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
    it('Post to /api/drivers creates a new driver', (done) => {
        //getting count of drivers from mongo database
        Driver.count().then( count => {
            //use supertest to make POST request
            request(app)
            .post('/api/drivers')
            .send({ email: 'test@test.com' }) //.send used to send data via post request
            .end( () => {
                Driver.count().then( newCount => {
                    assert(count + 1 === newCount);
                    done();
                });
            });
        });
    });

    it('Put to /api/drivers/id edits an existing driver', done => {
        const driver = new Driver({ email: 't@t.com', driving: false });
        
        driver.save().then(() => {
            //make http request
            request(app)
                .put(`/api/drivers/${driver._id}`)
                .send({ driving: true })
                .end(() => {
                    //fetch from database
                    Driver.findOne({ email: 't@t.com' })
                    .then(driver => {
                        assert(driver.driving === true);
                        done();
                    })
                })
        });
    });

    it('Delete to /api/drivers/id removes an existing driver', done => {
        const driver = new Driver({ email: 'test@test.com' });

        driver.save().then(() => {

            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {
                    Driver.findOne({ email: 'test@test.com' })
                        .then(driver => {
                            assert(driver === null);
                            done();
                        })
                })
        });
    });

    it(' GET to /api/drivers finds drivers in a location', done => {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
        });
        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: { type: 'Point', coordinates: [ -80.253, 25.791] }
        });

        Promise.all([ seattleDriver.save(), miamiDriver.save() ])
            .then( () => {
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        assert(response.body.length === 1);
                        assert(response.body[0].obj.email === 'miami@test.com');
                        done();
                    })
            });
    })
});