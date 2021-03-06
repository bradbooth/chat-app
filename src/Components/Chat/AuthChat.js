// Can talk to multiple people

import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Chat from './Chat'
import io from "socket.io-client";
import SocketIOFileUpload from 'socketio-file-upload';
import './AuthChat.css'; 

var socket;

class AuthChat extends Component {

    constructor() {
      super();

      this.state = {
        id: null,
        users: [],
        chatHistory: [],
        selectedUser: null,
        siofu: new SocketIOFileUpload(io.connect())
      };
    }

    componentWillUnmount = () => {
      socket.close()
    }
  
    componentDidMount = () => {

      socket = io({
        query: {
          token: `${this.props.auth.jwtToken}`
        }
      })
              
      socket.emit('join', {
        username: this.props.user.username,
        jwtToken: this.props.auth.jwtToken
      })

      socket.on('joined', (id) => {
        console.log(`Your id is ${id}`)
        this.setState({
          id: id,
        })
      })

      socket.on('update-users', (msg) => {
        console.log('update-users', msg)
        this.setState({
          users: msg.users
        })
      })

    }

    getAgents = () => {
      return this.state.users.filter( user => user.isAgent )
    }

    getOtherAgents = () => {
      return this.getAgents().filter( user => user.id !== this.state.id )
    }

    getUsers = () => {
      return this.state.users.filter( user => !user.isAgent )
    }

    getSelf = () => {
      return this.state.users.find( user => user.id === this.state.id )
    }

    getAssignedUsers = () => {
      const self = this.getSelf()
      return self ? 
             self.assignedUsers.map(id => ({id: id})) : 
             []
    }

    getAsUserList = (items) => {
      return items.map( (item,index) => 
        <li 
          className="chat-list-item "
          key={index}
          onClick={(e) => this.setSelectedUser(e, item)}
        >
          {item.username && item.username + " - " } {item.id}
        </li>)
    }

    setSelectedUser = (e, user) => {
      console.log('setSelectedUser', user)
      this.setState({
        selectedUser: user.id
      })
    }

    /** Get the chat history corresponding to the selected user */
    getSelectedUserChatHistory = () => {
      const selectedUser = this.state.users.find( user => user.id === this.state.selectedUser)
      console.log('getSelectedUserChatHistory', selectedUser)
      if ( selectedUser ){

        // If its an agent talking to an agent then only show their messages
        if ( this.getAgents().some( x => x.id === selectedUser.id )){
          return selectedUser.chatHistory.filter( 
            msg => msg.to   === this.state.id ||
                   msg.from === this.state.id 
        )} else {
        // Otherwise show all messages sent to a client from all agents
          return selectedUser.chatHistory.filter( 
            msg => msg.to   === this.state.selectedUser ||
                   msg.from === this.state.selectedUser 
        )}
      } else {
        return []
      }
    }

    transferUser = (e, data) => {

      const user = data.target.innerText
      const agent = data.id
      console.log("transfer ", user, "to", agent)

      socket.emit('transfer-user', {
        user: user,
        agent: agent,
      })
    }

    /**
     * Assigned users can be right-clicked to transfer
     */
    getAssignedUserList = () => {
      return this.getAssignedUsers().map((item, i) => 
        <ContextMenuTrigger 
          id={`SIMPLE`} 
          key={i}
          holdToDisplay={1000}
        >
          <li
            className="chat-list-item "
            onClick={(e) => this.setSelectedUser(e, item)}>
              { item.id }
          </li>
        </ContextMenuTrigger>
      )
    }

    sendMessage = (msg) => {
        socket.emit( 'send-message', msg )
    }

    render() {
  
      return (
        <Container fluid>
          <Row className="auth-chat-container">
            <Col xs={4} className="auth-chat-sidebar">
              <div className="auth-chat-authenticated-users">
                All Agents
                <ul>
                  { this.getAsUserList(this.getAgents()) }
                </ul>
              </div>
              <div className="auth-chat-anonymous-users">
                All Anonymous Users
                <ul>
                  { this.getAsUserList(this.getUsers()) }
                </ul>
              </div>
              <div className="auth-chat-authenticated-users">
                Your Assigned users
                <ul>
                  { this.getAssignedUserList() }
                </ul>
              </div>
            </Col>

            <Col xs={8} className="auth-chat-window">
              <Row>
                <Col className="chat-header">
                  <h3>Chatting with: {this.state.selectedUser} </h3>
                </Col>
              </Row>
                <Chat
                  className="chat-messages-container"
                  to={ this.state.selectedUser }
                  from={ this.state.id }
                  chat={ this.getSelectedUserChatHistory() }
                  sendMessage={ this.sendMessage }
                  siofu={this.state.siofu}
                />
            </Col>
          </Row>

        {/* Right click menu */}
          <ContextMenu id="SIMPLE">
            <div> Transfer to: </div>
            { this.getOtherAgents().length === 0 && 
              <div>No agents avaliable</div>  
            }
            { this.getOtherAgents().map( (item, index) =>
              <MenuItem 
                key={index} 
                data={{ id: item.id }} 
                onClick={this.transferUser}
              >
                <span>{item.username}</span>
              </MenuItem> 
            )}
          </ContextMenu>

        </Container>
      )
    }
  }

const mapStateToProps = state => {
  return { 
    user: state.user,
    auth: state.authentication
  };
};

export default connect(mapStateToProps)(AuthChat);