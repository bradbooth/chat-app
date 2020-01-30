const dotenv = require('dotenv').config()
const db = require('./database')
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http').createServer(app)
const io = require("socket.io")(http, { origins: '*:*'});

const port = 4001
const publicPath = path.join(__dirname, 'build');

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(publicPath));

// Websockets
io.on('connection', function(socket){
  console.log('a user connected');

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

// Login matches credentials in database
app.post('/api/login', (request, response) => {

  const username = request.body.username
  const password = request.body.password

  db.verifyUser(username, password, (err, res) => {
    response.send({
      valid: res
    })
  })
})

// Use passport to authenticate eventually

// Serve web pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
http.listen(port, () => {
  console.log('Server is up on port ' + port);
});