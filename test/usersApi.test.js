const expect = require('expect')
const request = require('supertest')
const app = require('../server')
const User = require('../models/index').User;

const CREDENTIALS = {
    login: "test",
    password: "123456"
};

describe('Testing users api', () => {

    it('should register and return token', (done) => {
        User.destroy({ where: { login: "test" } })
            .then(() => {
                request(app)
                    .post('/api/users')
                    .send(CREDENTIALS)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.token).toBeDefined();
                        done();
                    });
            });
    })

})