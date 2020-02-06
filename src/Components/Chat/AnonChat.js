import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Chat from './Chat'

var socket;

const ENDPOINT = 'http://localhost:4001'
class AnonChat extends Component {

    constructor() {
      super();

      this.state = {
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
      socket.on('chat message', (msg) => {
        this.setState({
          chat: [...this.state.chat, msg]
        })
      })

      socket.on( 'receive-message' , (res) => {
        console.log('receive-message', res)
        this.setState({
          chat: [ ...this.state.chat, res ]
        })
      })

      socket.on( 'assigned-agent' , (msg) => {
        this.setState({
          message: {
            ...this.state.message,
            to: msg
          }
        })
      })
      
      socket.emit('join', {
        username: this.state.username
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

    setMessage = (e) => {
      this.setState({
        message: {
          ...this.state.message,
          value: e.target.value
        }})
    }



    sendMessage = (msg) => {
      socket.emit( 'send-message', msg )
    }

    getChat = () => {
 
      return this.state.chat.map( (msg, key) => <p key={key}>{msg.message}</p>)
    }

    render() {
  
      return (
        <div>
          <h3 style={{textAlign: "center"}}>
            {this.state.message.to ? 'Connected' : 'Waiting for an agent...'}
          </h3>
          <Chat
            className="chat-messages-container"
            to={ this.state.message.to }
            from={ this.state.message.from }
            chat={ this.state.chat }
            sendMessage={ this.sendMessage }
          />
          {/* <h1>Anonymous Chat</h1>
          <p>To: {this.state.message.to} </p>
          <input 
            type="text"
            placeholder="Send message..."
            value={ this.state.message.value }
            onChange={ this.setMessage }
            onKeyDown={ this.sendMessage }
          />
          { this.getChat() } */}

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

export default connect(mapStateToProps)(AnonChat);