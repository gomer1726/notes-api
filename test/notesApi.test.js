const expect = require('expect')
const request = require('supertest')
const app = require('../server')
const User = require('../models/index').User;
const Note = require('../models/index').Note;

let NOTE = {};
const CREDENTIALS = {
    login: "test",
    password: "123456"
};
let HEADERS = {
    'x-auth-token': "",
    Accept: 'application/json'
};

describe('Testing notes api', () => {
    before(done => {
        User.destroy({where: {login: "test"}})
            .then(() => {
                request(app)
                    .post('/api/users')
                    .send(CREDENTIALS)
                    .end((err, res) => {
                        HEADERS['x-auth-token'] = res.body.token;
                        done();
                    });
            });
    });

    it('should add note', (done) => {
        const text = "This is a test note";
        request(app)
            .post('/api/notes')
            .send({text})
            .set(HEADERS)
            .expect(201)
            .expect(res => {
                NOTE = res.body;
                expect(NOTE.text).toBe(text);
            })
            .expect(res => {
                expect(NOTE.isPublic).toBe(false);
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    it('should get user notes', (done) => {
        request(app)
            .get('/api/notes')
            .set(HEADERS)
            .expect(200)
            .expect(res => {
                expect(res.body.notes[0].id).toEqual(NOTE.id);
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
            .send({text, isPublic: true})
            .set(HEADERS)
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
            .set(HEADERS)
            .expect(204)
            .expect(res => {
                Note.findByPk(NOTE.id).then(note => expect(note).toBeNull());
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    // Now let's try to test for negative results

    it('should not delete non-existing note', (done) => {
        request(app)
            .delete(`/api/notes/${NOTE.id}`)
            .set(HEADERS)
            .expect(404, done)
    })

    it('should not update non-existing note', (done) => {
        const text = "Text was changed";
        request(app)
            .put(`/api/notes/${NOTE.id}`)
            .send({text, isPublic: true})
            .set(HEADERS)
            .expect(404, done)
    })

    it('should not find non-existing note', (done) => {
        request(app)
            .get(`/api/notes/public/${NOTE.id}`)
            .expect(404, done)
    })

    it('should not add note with empty body', (done) => {
        request(app)
            .post('/api/notes')
            .set(HEADERS)
            .expect(422)
            .expect(res => {
                expect(res.body.errors).toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    })

    // Now, without token

    it('should not add without token', (done) => {
        request(app).post('/api/notes').expect(403, done);
    })

    it('should not get iser notes without token', (done) => {
        request(app).get('/api/notes').expect(403, done);
    })

    it('should not update the note without token', (done) => {
        request(app).put(`/api/notes/${NOTE.id}`).expect(403, done)
    })

    it('should not delete note without token', (done) => {
        request(app).delete(`/api/notes/${NOTE.id}`).expect(403, done)
    })

})