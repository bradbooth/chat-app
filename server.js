const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app)
const io = require("socket.io")(http, { origins: '*:*'});

const port = 4001
const publicPath = path.join(__dirname, 'build');


app.use(express.static(publicPath));

// Websockets
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })


  socket.on('clientJoined', (msg) => {
    console.log('Creating room for:', msg)
    socket.join(msg)
  })



  socket.on('chat message', (msg) => {
    console.log("Received message: ", msg)
    io.to(msg.to).emit('chat message', `${msg.from}:${msg.message}`);
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