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
        to: '',
        id: ''
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
          to: msg
        })
      })
      
      socket.emit('join', {
        username: this.state.username
      })
      
      socket.on('joined', (msg) => {
        console.log(`Your id is ${msg.id}`)
        this.setState({
          id: msg.id
        })
      })   
    }

    componentWillUnmount = () => {
      socket.close()
    }

    sendMessage = (msg) => {
      socket.emit( 'send-message', msg )
    }

    render() {
  
      return (
        <div>
          <h3 style={{textAlign: "center"}}>
            {this.state.to ? 'Connected' : 'Waiting for an agent...'}
          </h3>
          <Chat
            className="chat-messages-container"
            to={ this.state.to }
            from={ this.state.id }
            chat={ this.state.chat }
            sendMessage={ this.sendMessage }
          />
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