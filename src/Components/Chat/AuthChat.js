// Can talk to multiple people

import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap';
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
        chat: [],
        id: '',
        selectedUser: ''
      };
    }
  
    componentDidMount = () => {
      
      socket = io(ENDPOINT + `?token=${this.props.auth.jwtToken}`)

      socket.on('users', (msg) => {
        this.setState({
          users: msg.users,
          authUsers: msg.authorizedUsers
        })
      })

      socket.on( 'receive-message' , (res) => {
        console.log('receive-message', res)
        this.setState({
          chat: [ ...this.state.chat, res ]
        })
      })
      
      socket.emit('join', {
        username: this.props.user.username,
        jwtToken: this.props.auth.jwtToken
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

    getUserList = (users) => {
      return users.map ( (x,i) => 
        <li 
          style={{cursor: 'pointer', listStyle: 'none'}}
          key={i} 
          onClick={(e) => this.setUser(e, x.socketId) }>{x.socketId}</li>
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
                Auth users
                <ul>
                  { this.getUserList(this.state.authUsers) }
                </ul>
              </div>
              <div className="auth-chat-anonymous-users">
                Anon users
                <ul>
                  { this.getUserList(this.state.users) }
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