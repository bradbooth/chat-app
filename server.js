const dotenv = require('dotenv').config()
const db = require('./database')
const passport = require('./passport').passport
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http').createServer(app)
const io = require("socket.io")(http, { origins: '*:*'});
const jwt = require('jsonwebtoken');

const port = 4001
const publicPath = path.join(__dirname, 'build');

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(publicPath));
app.use(passport.initialize());
app.use(passport.session());

// Websockets
io.on('connection', function(socket){
  console.log('a user connected');
  console.log(io.sockets.clients())

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

  // Create a room per user
  socket.on('clientJoined', (msg) => {
    console.log('Creating room for:', msg)
    socket.join(msg)
  })

  // Send chat message
  socket.on('chat message', (msg) => {
    console.log("Received message: ", msg)
    io.to(msg.to).emit('chat message', `${msg.from}:${msg.message}`);
  })

});


// Create/Update user in database
app.post('/api/createUser', (request, response) => {

  const username = request.body.username
  const password = request.body.password

  db.createNewUser(username, password, (err, res) => {
    response.send('success')
  })
})

app.post('/api/login', 
  passport.authenticate('local'),
  (request, response) => {
    // console.log(request.user, process.env.secret)
    // Create JWT Token signed with username
    const token = jwt.sign(
      { _id: request.user._id }, 
      process.env.secret,
      { expiresIn: '1d' });

    return response.json({ 
      token,  
      redirect: "/chat" 
    });
})

app.get('/api/authenticated',
  passport.authenticate('jwt', {session: false}), 
  (request, response) => {

    console.log('Server jwt authentication successful')
    response.sendStatus(200)
  }
)

// Serve web pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
http.listen(port, () => {
  console.log('Server is up on port ' + port);
});