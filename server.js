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

const printAllUsers = () => {
  console.log(
    "Auth:", authorizedUsers, '\n',
    "Users:", users
  )
}

/**
 * Updated all authorized users with the current
 * state of users
 */
const updateUsers = () => {
  io.to(AUTHORIZED).emit('users', {
    users,
    authorizedUsers
  })
}

/**
 * Attempt to assign next avaliable agent to a user,
 * chooising the next agent with the least amount of
 * users currently
 */
const assignNextAgent = () => {

  // Find the next agent with least amount of users currently assigned
  const nextAgent = authorizedUsers.reduce(
    (minUsr, usr) => {
      if ( usr.assignedUsers.length < minUsr.assignedUsers.length ){
        return usr
      } else {
        return minUsr
      }
    },
    authorizedUsers[0] //Default to first authorized user
  );

  const nextAgentIndex = authorizedUsers.indexOf(nextAgent)
  const nextUserIndex  = users.findIndex( x => x.assignedAgent == null )

  // If theres an avaliable agent and a waiting user
  if ( nextAgentIndex >= 0 && nextUserIndex >= 0 ){

    const usrSocketId = users[nextUserIndex].socketId
    const agtSocketId = authorizedUsers[nextAgentIndex].socketId

    // Add the user to list of assigned users
    authorizedUsers[nextAgentIndex].assignedUsers.push(usrSocketId)
    
    // Assign agent to user and notify of agent id
    users[nextUserIndex].assignedAgent = agtSocketId
    io.to(usrSocketId).emit('assigned-agent', { socketId: agtSocketId } )

  }
}


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', (msg) => {

    // Remove the user/agent from our active users/agents list
    users = users.filter( usr => usr.socketId != socket.id )
    authorizedUsers = authorizedUsers.filter( usr => usr.socketId != socket.id )
    
    // If the user was assigned an agent, remove the assignment
    authorizedUsers = authorizedUsers.map( agent => {
      agent.assignedUsers = agent.assignedUsers.filter( x => x !== socket.id )
      return agent
    })

    // If the socket was an agent, remove the assigned agent from user
    users = users.map( user => {
      if ( user.assignedAgent === socket.id ){
        user.assignedAgent = null
        // Notify the user that agent disconnected
        io.to(user.socketId).emit('assigned-agent', { socketId: null })
      }
      return user
    })

    assignNextAgent()
    printAllUsers()
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
          socketId: socket.id,
          assignedAgent: null
        })
      } else {
        console.log('Authorized: ', decoded)
        authorizedUsers.push({
          socketId: socket.id,
          assignedUsers: []
        })
        socket.join(AUTHORIZED)
      }

      // If possible, assign user to an agent or vise versa
      assignNextAgent()
      printAllUsers()
    })

    // Respond with socket-id
    io.to(socket.id).emit('joined', {
      id: socket.id
    });

    updateUsers()
  })

  /**
   * Send a message to another user
   */
  socket.on('send-message', (msg) => {

    console.log("send-message", msg)

    const message = {
      sender: msg.from,
      recipient: msg.to,
      message: msg.value
    }

    io.to(msg.to).emit('receive-message', message)
    io.to(msg.from).emit('receive-message', message)
  })

  /**
   * Assign a user the given agent
   */
  socket.on('assign-user', (msg) => {
    console.log(msg)
    io.to(msg.user).emit('assigned-agent', { socketId: msg.agent })
  })

  /**
   * Transfer a user from one agent to another
   */
  socket.on('transfer-user', (msg) => {
    console.log('transfer-user', msg, socket.id)

    authorizedUsers = authorizedUsers.map( usr => {
      // Remove user from current agent
      if ( usr.socketId === socket.id ){
        usr.assignedUsers = usr.assignedUsers.filter( x => x !== msg.user )
      }
      // Assign user to new agent
      if ( usr.socketId === msg.agent ){
        usr.assignedUsers = usr.assignedUsers.concat(msg.user)
      }
      return usr
    })

    // Change the users assigned agent and notify the user of the change
    users = users.map( usr => {
      if ( usr.socketId === msg.user ){
        usr.assignedAgent = msg.agent
        io.to(usr.socketId).emit('assigned-agent', { socketId: msg.agent })
      }
      return usr
    })

    updateUsers()
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