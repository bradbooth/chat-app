const assert = require('assert');

describe('Database', function() {

    var db;

    before(function () {
        db = require('../server/database')

    });
    after(function () {

    });

    describe('Database connections', function() {

        var username = 'test';
        var password = 'test';
        var userid   = '5e4ecfb4686d182f1a5928a5';

        it('Ensure database credentials are avaliable', function() {
            assert.ok(process.env.admin)
        });

        it('Ensure database secret is avaliable', function() {
            assert.ok(process.env.secret)
        });

        it('Verify test user found', function() {
            db.verifyUser(username, password, (err, res) => {
                assert.ok(res)
                assert.equal(res.username, username)
            })
        });

        it('Verify no errors thrown on user request', function() {
            db.verifyUser(username, password, (err, res) => {
                assert.ifError(err)
            })
        });

        it('Verify correct test user returned', function() {
            db.verifyUser(username, password, (err, res) => {
                assert.ok(res)
                assert.equal(res.username, username)
            })
        });

        it('Verify password not in plaintext', function() {
            db.verifyUser(username, password, (err, res) => {
                assert.ok(res)
                assert.notEqual(res.password, password)
            })
        });

        it('Verify find user by id', function() {
            db.findUserById(userid, (res) => {
                assert.ok(res)
            })
        });

        it('Verify correct user returned by id', function() {
            db.findUserById(userid, (res) => {
                assert.equal(res.username, username)
                assert.equal(res._id, userid)
            })
        });
    })   

});