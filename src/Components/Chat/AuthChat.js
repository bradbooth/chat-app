// Can talk to multiple people

import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

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
        message: {
          to: '',
          from: '',
          value: ''
        }
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
          message: {
            ...this.state.message,
            from: msg.id
          }
        })
      })
      
    }

    componentWillUnmount = () => {
      socket.close()
    }

    setUser = (e, socketId) => {
      socket.emit('assign-user', {
        agent: this.state.message.from,
        user: socketId
      })

      this.setState({
        message: {
          ...this.state.message,
          to: socketId
        }
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

    setMessage = (e) => {
      this.setState({
        message: {
          ...this.state.message,
          value: e.target.value
        }})
    }

    sendMessage = (e) => {
      if ( e.key === 'Enter'){
        socket.emit( 'send-message', this.state.message )
        this.setState({
          message: {
            ...this.state.message,
            value: ''
          }
        })
      }
    }


    getChat = () => {
      // Only show messages relating to currently selected recipent
      const messages = this.state.chat.filter( 
        msg => msg.sender    === this.state.message.to ||
               msg.recipient === this.state.message.to
      )        
      return messages.map( (msg, key) => <p key={key}>{msg.message}</p>)
    }

    render() {
  
      return (
        <div style={{ textAlign: "center" }}>

            <h1>Authenticated Chat</h1>
            <p>Anonymous Users Online:</p>
            <ul>
              { this.getUserList(this.state.users) }
            </ul>
            <p>Authenticated Users Online:</p>
            <ul>
              { this.getUserList(this.state.authUsers) }
            </ul>
            <br/>
            <p>To: {this.state.message.to} </p>
            <input 
              type="text"
              placeholder="Send message..."
              value={ this.state.message.value }
              onChange={ this.setMessage }
              onKeyDown={ this.sendMessage }
            />
            { this.getChat() }

        </div>
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