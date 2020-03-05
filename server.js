const dotenv = require('dotenv').config()
const passport = require('./server/passport').passport
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http').createServer(app)
const io = require("socket.io")(http, { origins: '*:*'});
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 4001
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
const DEBUG = true;

let users = []

const printAllUsers = () => {
  if (DEBUG) console.log(
    "**********************  \n",
    "Current users:          \n",
    "Agents:", getAgents(), '\n',
    "Users:",   getUsers(), '\n',
    "**********************  \n"
  )
}

const getAgents = () => {
  return users.filter( user => user.isAgent === true )
}

const getUsers = () => {
  return users.filter( user => user.isAgent === false )
}

const getUser = (userId) => {
  return users.find( user => user.id === userId )
}

const getIndexOfUser = (userId) => {
  return users.findIndex( usr => usr.id === userId )
}

// Send the current state of users to all agents
const updateAgents = () => {
  io.to(AUTHORIZED).emit('update-users', {
    users
  })
}

/**
 * Assign the next avaliable user to the agent with
 * the smallest number of currently assigned users
 */
const assignAgent = () => {

  // Find the next user who is not assigned an agent
  const nextUser = getUsers().find( user => user.assignedAgent === null )
  if ( !nextUser ) return

  // Find next agent with minimum number of users
  const nextAgent = getAgents().reduce(
    (agentWithMinUsers, currAgent) => {
      if ( currAgent.assignedUsers.length < agentWithMinUsers.assignedUsers.length ){
        return currAgent
      } else {
        return agentWithMinUsers
      }
    },
    getAgents()[0] //Default to first agent
  );

  // If there is an agent & user avaliable
  if ( nextAgent && nextUser ){

    const nextAgentIndex = users.indexOf(nextAgent)
    const nextAgentId = users[nextAgentIndex].id
    
    const nextUserIndex = users.indexOf(nextUser)
    const nextUserId = users[nextUserIndex].id

    users[nextAgentIndex].assignedUsers.push(nextUserId)
    users[nextUserIndex ].assignedAgent = nextAgentId

    // Update user of their assignment
    io.to(nextUserId).emit('assigned-agent', nextAgentId)
  }

}

/**
 * On connection to server
 */
io.on('connection', (socket) => {
  
  socket.on('join', (msg) => {
    if (DEBUG) console.log('join', msg)
    jwt.verify(
      msg.jwtToken, 
      process.env.secret, 
      (err, decoded) => {

      if ( err ){
        if (DEBUG) console.log('Unauthorized')
        users.push({
          id: socket.id,
          assignedAgent: null,
          isAgent: false,
          chatHistory: []
        })
      } else {
        if (DEBUG) console.log('Authorized: ', decoded)
        users.push({
          username: decoded._username,
          id: socket.id,
          assignedUsers: [],
          isAgent: true,
          chatHistory: []
        })
        socket.join(AUTHORIZED)
      }
    })

    io.to(socket.id).emit('joined', socket.id)

    assignAgent()
    printAllUsers()
    updateAgents()
  })
  
  socket.on('disconnect', (msg) => {
    if (DEBUG) console.log('disconnect', msg)

    const disconnectingUserId = socket.id

    users = users.filter( user => user.id !== disconnectingUserId )

    //Remove user from all assignments
    users = users.map( user => {

      // Remove the user from agents assigned users
      if ( user.isAgent ){
        user.assignedUsers = user.assignedUsers.filter( id => id !== disconnectingUserId )
      }

      // If the agent disconnected, remove the assigned agent from users
      if ( !user.isAgent && user.assignedAgent === disconnectingUserId ){
        user.assignedAgent = null
        // Attempt to reassign a new agent
        assignAgent()
      }

      return user
    })

    assignAgent()
    updateAgents()
    printAllUsers()
  })

  socket.on('send-message', (msg) => {
    
    const message = {
      to: msg.to,
      from: socket.id,
      value: msg.value
    }

    if (DEBUG) console.log('send-message', message)
    // Ignore incorecctly formatted messages
    if ( message.to === null || message.from === null ) return

    // Update users chat histories
    users = users.map( user => {
      // Add message to both users chat histories
      if ( user.id == message.to || user.id == message.from ){
        user.chatHistory = user.chatHistory.concat(message)
      }
      return user
    })

    // Update users/agents with their new chat history
    io.to(message.to  ).emit('receive-message', getUser(message.to).chatHistory)
    io.to(message.from).emit('receive-message', getUser(message.from).chatHistory)

    printAllUsers()
    updateAgents()
  })

  socket.on('transfer-user', (msg) =>{
    if (DEBUG) console.log('transfer-user', msg)
    // user: ... , agent: ...

    // Update users assigned agent
    const indexOfUser = getIndexOfUser(msg.user)
    users[indexOfUser].assignedAgent = msg.agent
    io.to(users[indexOfUser].id).emit('assigned-agent', msg.agent)

    // Update new agent with assigned user
    const indexOfNewAgent = getIndexOfUser(msg.agent)
    users[indexOfNewAgent].assignedUsers = users[indexOfNewAgent].assignedUsers.concat(msg.user)

    // Remove from current Agent
    const indexOfOldAgent = getIndexOfUser(socket.id)
    users[indexOfOldAgent].assignedUsers = users[indexOfOldAgent].assignedUsers.filter(
      id => id !== msg.user
    )

    updateAgents()

  })

});

// Serve web pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
var server = http.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = server;
