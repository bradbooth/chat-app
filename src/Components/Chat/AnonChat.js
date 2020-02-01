import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

var socket;

const ENDPOINT = 'http://localhost:4001'
class AnonChat extends Component {

    constructor() {
      super();

      this.state = {
        username: Math.floor((Math.random() * 10) + 1),
      };
    }
  
    componentDidMount = () => {
      
      socket = io(ENDPOINT + `?token=${this.props.auth.jwtToken}`)
      socket.on('chat message', (msg) => {
        this.setState({
          chat: [...this.state.chat, msg]
        })
      })
      
      socket.emit('join', {
        username: this.state.username
      })      
    }

    componentWillUnmount = () => {
      socket.close()
    }

    render() {
  
      return (
        <div style={{ textAlign: "center" }}>
  
          <h1>Anonymous Chat</h1>
          <p>Username: {this.state.username} </p>
          
          
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