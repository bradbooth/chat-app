const io = require("socket.io-client");

const assert = require('assert');

describe('Chat', function() {
    
    var server;
    var user1;
    var user2;

    before(function () {
        server = require('../server')
        user1 = io('http://localhost:4001', {
            query: {
                token: ``
            }
        })

        user2 = io('http://localhost:4001', {
            query: {
                token: ``
            }
        })
    });
    after(function () {
      server.close();
      user1.close();
      user2.close();
    });

    describe('Join and send messages', function() {

        var user1ID;
        var user2ID;

        it('Ensure successful connection', function() {
            this.retries(3);
            assert(user1.connected)
        });

        it('User1: Emitting a join request should respond with joined', function(done) {
            user1.emit('join', {
                username: 'testUser'
            })
            user1.on('joined', (id) => {
                assert.ok(id)
                user1ID = id
                done()
            })
        });

        it('User2: Emitting a join request should respond with joined', function(done) {
            user2.emit('join', {
                username: 'testUser'
            })
            user2.on('joined', (id) => {
                assert.ok(id)
                user2ID = id
                done()
            })
        });

        it('User1 should be able to send a message to User2', function() {
            const message = 'Hello'
            assert.ok(user1ID)
            assert.ok(user2ID)
            user1.emit( 'send-message', { to: user2ID, from: user1ID, value: message } )
            user1.on( 'receive-message' , (msg) => {
                assert.equal(msg[0].value, message)
            })
            user2.on( 'receive-message' , (msg) => {
                assert.equal(msg[0].value, message)
            })
        });

        it('User2 should be able to send a message to User1', function() {
            const message = 'Hi'
            assert.ok(user1ID)
            assert.ok(user2ID)
            user2.emit( 'send-message', { to: user2ID, from: user1ID, value: message } )
            user1.on( 'receive-message' , (msg) => {
                assert.equal(msg[1].value, message)
            })
            user2.on( 'receive-message' , (msg) => {
                assert.equal(msg[1].value, message)
            })
        });

    });

});
