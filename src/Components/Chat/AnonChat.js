import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

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

    sendMessage = (e) => {
      if ( e.key === 'Enter'){
        console.log('send:' + this.state.message.value)
        console.log(this.state)
        socket.emit( 'send-message', this.state.message )
        this.setState({
          message: {
            ...this.state.message,
            value: ''
          }
        }, console.log(this.state))
      }
    }

    getChat = () => {
 
      return this.state.chat.map( (msg, key) => <p key={key}>{msg.message}</p>)
    }

    render() {
  
      return (
        <div style={{ textAlign: "center" }}>
  
          <h1>Anonymous Chat</h1>
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

export default connect(mapStateToProps)(AnonChat);