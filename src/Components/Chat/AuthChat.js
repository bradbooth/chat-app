// Can talk to multiple people

import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Chat from './Chat'
import io from "socket.io-client";
import './AuthChat.css'; 

var socket;

const ENDPOINT = 'http://localhost:4001'

class AuthChat extends Component {

    constructor() {
      super();

      this.setUser = this.setUser.bind(this)

      this.state = {
        users: [],
        authUsers: [],
        assignedUsers: [],
        chat: [],
        id: '',
        selectedUser: '',
        menu: {
          target: null,
          items: []
        }
      };
    }
  
    componentDidMount = () => {
      
      socket = io(ENDPOINT + `?token=${this.props.auth.jwtToken}`)
      
      socket.emit('join', {
        username: this.props.user.username,
        jwtToken: this.props.auth.jwtToken
      })

      socket.on('users', (msg) => {

        const assignedUsers = msg.users
          .filter( x => x.assignedAgent === this.state.id )

        this.setState({
          users: msg.users,
          authUsers: msg.authorizedUsers,
          assignedUsers: assignedUsers
        })
      })

      socket.on( 'receive-message' , (res) => {
        console.log('receive-message', res)
        this.setState({
          chat: [ ...this.state.chat, res ]
        })
      })

      socket.on('joined', (msg) => {
        console.log(`Your id is ${msg.id}`)
        this.setState({
          id: msg.id,
        })
      })

    }

    componentWillUnmount = () => {
      socket.close()
    }

    setUser = (e, socketId) => {
      socket.emit('assign-user', {
        agent: this.state.id,
        user: socketId
      })

      this.setState({
        selectedUser: socketId
      })
    }

    setMenuItems = (e, socketId) => {
      // e.preventDefault()

      console.log(this.state.authUsers)
      this.setState({
        menu: {
          target: socketId,
          items: this.state.authUsers.filter(
            x => x.socketId !== this.state.id 
          )
        }
      })
      console.log("Target is:", socketId)
    }

    handleMenuItemClick = (e, data) => {
      console.log("transfer ", this.state.menu.target, "to", data.socketId)
      
      socket.emit('transfer-user', {
        user: this.state.menu.target,
        agent: data.socketId
      })
    }

    getUserList = (users) => {
      return users.map ( (x,i) =>
          <li 
            style={{cursor: 'pointer', listStyle: 'none'}}
            key={i} 
            onClick={(e) => this.setUser(e, x.socketId) }
            onContextMenu={ (e) => this.setMenuItems(e, x.socketId) }
          >
              {x.socketId == this.state.id && <b>(You) </b>}
              {x.username ? x.username : x.socketId}
         </li>
      )
    }

    /**
     * Assigned users can be right-clicked to transfer
     */
    getAssignedUserList = (users) => {
      return this.getUserList(users).map((listItem, i) => 
        <ContextMenuTrigger 
          id={`SIMPLE`} 
          key={i} 
          holdToDisplay={1000}
        >
          { listItem }
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
                All Authenticated Users
                <ul>
                  { this.getUserList(this.state.authUsers) }
                </ul>
              </div>
              <div className="auth-chat-anonymous-users">
                All Anonymous Users
                <ul>
                  { this.getUserList(this.state.users) }
                </ul>
              </div>
              <div className="auth-chat-authenticated-users">
                Your Assigned users
                <ul>
                  { this.getAssignedUserList(this.state.assignedUsers) }
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
                  chat={ this.state.chat }
                  sendMessage={ this.sendMessage }
                />
            </Col>
          </Row>

        {/* Right click menu */}
          <ContextMenu id="SIMPLE">
            <div> Transfer to: </div>
            { this.state.menu.items.length === 0 && 
              <div>No agents avaliable</div>  
            }
            { this.state.menu.items.map( (item, index) =>
              <MenuItem 
                key={index} 
                data={{ socketId: item.socketId }} 
                onClick={this.handleMenuItemClick}
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