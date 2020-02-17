const express = require('express');
const app = express();
const db = require('../database')
const passport = require('../passport').passport
const jwt = require('jsonwebtoken');


app.post('/api/login', 
  passport.authenticate('local'),
  (request, response) => {

    // Create JWT Token with user id
    console.log("REQUEST:", )
    const token = jwt.sign(
      { _id: request.user._id, _username: request.user.username }, 
      process.env.secret,
      { expiresIn: '1d' });

    return response.json({ 
      token,
      user: {
        username: request.user.username,
      }
    });
})

// Create/Update user in database
app.post('/api/createUser', (request, response) => {

    const username = request.body.username
    const password = request.body.password
  
    db.createNewUser(username, password, (err, res) => {
      response.send('success')
    })

})

// Verify if currently authenticated
app.get('/api/authenticated',
  passport.authenticate('jwt', {session: false}), 
  (request, response) => {

    console.log('Server jwt authentication successful')
    response.sendStatus(200)
  }
)

module.exports = app;