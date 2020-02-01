import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Auth from '../../Auth/Auth'

var socket;
const ENDPOINT = 'http://localhost:4001'

class Chat extends Component {

    constructor() {
      super();
  
      socket = io(ENDPOINT)
      socket.on('chat message', (msg) => {
        this.setState({
          chat: this.state.chat + " " + msg
        })
      })

      this.state = {
        to: "",
        value: "",
        chat: ""
      };
    }
  

    getOnlineUsers = () => {
      Auth.authenticatedRequest('/api/getOnlineUsers').then( 
        (res) => {
          console.log(res.status)
        })
    }

    componentDidMount = () => {
      socket.emit('clientJoined', this.props.user.username)
      this.getOnlineUsers()
    }
  
    handleChange = (e) => {
      this.setState({
        value: e.target.value
      })
    }
    
    sendMessage = (e) => {
      if ( e.key === 'Enter' ){
        socket.emit('chat message', {
          to: this.state.to,
          from: this.props.user.username,
          message: this.state.value
        })
        this.setState({
          value: ""
        })
      }
    }
  
    setUser = (e) => {
      this.setState({
        user: e.target.value
      })
    }
  
    sendUser = (e) => {
      if ( e.key === 'Enter' ){
        
      }
    }
  
    setTo = (e) => {
      this.setState({
        to: e.target.value
      })
    }
  
    render() {
  
      return (
        <div style={{ textAlign: "center" }}>
  
          <h1>Chat</h1>
          <div>
          <p>user: { this.props.user.username }</p>
          <br/>
  
            <p>to:</p>
            <input 
              type="text"
              value={this.state.to}
              onChange={this.setTo}
            />
            <br/>
  
            <p>message:</p>
            <input 
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.sendMessage}
            />
  
            <div>
              <p>Received from socket.io:</p>
              <p>{this.state.chat}</p>
            </div>
          </div>
          
        </div>
      )
    }
  }

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Chat);