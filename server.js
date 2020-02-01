const dotenv = require('dotenv').config()
const db = require('./server/database')
const passport = require('./server/passport').passport
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
const routes = require('./server/routes/routes');


app.use(cors())
app.use(bodyParser.json())
app.use(express.static(publicPath));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);


// TODO - Move websockets to own file
const AUTHORIZED = 'authorized'

let users = []
let authorizedUsers = []

const updateUsers = () => {
  io.to(AUTHORIZED).emit('users', {
    users,
    authorizedUsers
  })
}


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', (msg) => {

    users = users.filter( usr => usr.socketId != socket.id )
    authorizedUsers = authorizedUsers.filter( usr => usr.socketId != socket.id )
    
    updateUsers()
    console.log('a user disconnected:', socket.id)
  })

  // Keep track of users who join with/out authorization
  socket.on('join', (msg) => {
    console.log('Creating room for:', msg)

    jwt.verify(
      msg.jwtToken, 
      process.env.secret, 
      (err, decoded) => {

      if ( err ){
        console.log('Unauthorized')
        users.push({
          socketId: socket.id
        })
      } else {
        console.log('Authorized: ', decoded)
        authorizedUsers.push({
          socketId: socket.id
        })
        socket.join(AUTHORIZED)
      }
    })

    // Respond with socket-id
    io.to(socket.id).emit('joined', {
      id: socket.id
    });

    updateUsers()
  })

  socket.on('send-message', (msg) => {
    io.to(msg.to).emit('receive-message', msg)
    io.to(msg.from).emit('receive-message', msg)
  })

  socket.on('assign-user', (msg) => {
    console.log(msg)
    io.to(msg.user).emit('assigned-agent', msg.agent)
  })

});

// Serve web pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
http.listen(port, () => {
  console.log('Server is up on port ' + port);
});