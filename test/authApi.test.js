const expect = require('expect')
const request = require('supertest')
const app = require('../server')
const User = require('../models/index').User;

let AUTH_TOKEN = "";
let USER = {};
const CREDENTIALS = {
    login: "test",
    password: "123456"
};

describe('Testing auth api', () => {
    before(done => {
        User.destroy({ where: { login: "test" } })
            .then(() => {
                request(app)
                    .post('/api/users')
                    .send(CREDENTIALS)
                    .end((err, res) => {
                    AUTH_TOKEN = res.body.token;
                    done();
                });
            });
    });

    it('should get logged in user', (done) => {
        request(app)
            .get('/api/auth')
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(200)
            .expect(res => {
                USER = res.body;
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('should login', (done) => {
        request(app)
            .post('/api/auth')
            .send(CREDENTIALS)
            .expect(200)
            .expect(res => {
                expect(res.body.token).toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('terminate session', (done) => {
        request(app)
            .post('/api/auth/terminate/all')
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(200)
            .expect(res => {
                request(app)
                    .get('/api/auth')
                    .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
                    .expect(403)
                    .expect(res => {
                        expect(res.body.message).toBe("Unauthorized");
                    });
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

})