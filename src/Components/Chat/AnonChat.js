import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Chat from './Chat'

var socket;

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
      
      socket = io({
        query: {
          token: `${this.props.auth.jwtToken}`
        }
      })

      socket.on( 'receive-message' , (msg) => {
        console.log('receive-message', msg)
        this.setState({
          chat: [ ...msg ]
        })
      })

      socket.on( 'assigned-agent' , (id) => {
        console.log('assigned-agent', id)
        this.setState({
          to: id,
        })
      })
      
      socket.emit('join', {
        username: this.state.username
      })
      
      socket.on('joined', (id) => {
        console.log(`Your id is ${id}`)
        this.setState({
          id: id
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