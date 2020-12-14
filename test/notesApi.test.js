const expect = require('expect')
const request = require('supertest')
const app = require('../server')
const User = require('../models/index').User;

let AUTH_TOKEN = "";
let NOTE = {};

describe('Testing notes api', () => {
    before(done => {
        User.destroy({ where: { login: "test" } })
            .then(() => {
                request(app)
                    .post('/api/users')
                    .send({
                        login: "test",
                        password: "123456"
                    }).end((err, res) => {
                        AUTH_TOKEN = res.body.token;
                        done();
                    });
            });
    });

    it('should add note', (done) => {
        const text = "This is a test note";
        request(app)
            .post('/api/notes')
            .send({ text })
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(201)
            .expect(res => {
                NOTE = res.body;
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('should get user notes with statusCode = 200', (done) => {
        request(app)
            .get('/api/notes')
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(200)
            .expect(res => {
                const found = res.body.notes.find(n => n.id === NOTE.id);
                expect(found.id).toBe(NOTE.id);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })

    it('should update the note', (done) => {
        const text = "Text was changed";
        request(app)
            .put(`/api/notes/${NOTE.id}`)
            .send({ text, isPublic: true })
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(200)
            .expect(res => {
                NOTE = res.body;
                expect(res.body.text).toBe(text);
                expect(res.body.isPublic).toBe(true);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('should show public note without auth', (done) => {
        request(app)
            .get(`/api/notes/public/${NOTE.id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(NOTE.text);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('should delete note', (done) => {
        request(app)
            .delete(`/api/notes/${NOTE.id}`)
            .set({ 'x-auth-token': AUTH_TOKEN, Accept: 'application/json' })
            .expect(204)
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

})