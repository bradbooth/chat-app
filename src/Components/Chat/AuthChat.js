// Can talk to multiple people

import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

var socket;

const ENDPOINT = 'http://localhost:4001'

class AuthChat extends Component {

    constructor() {
      super();

      this.state = {
        users: [],
        authUsers: []
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
      
      socket.emit('join', {
        username: this.props.user.username,
        jwtToken: this.props.auth.jwtToken
      })
      
    }


    componentWillUnmount = () => {
      socket.close()
    }
  
    render() {
  
      return (
        <div style={{ textAlign: "center" }}>
  
            <h1>Authenticated Chat</h1>
            <p>Anonymous Users Online:</p>
            <ul>
              { this.state.users.map ( x => <li>{x.socketId}</li>)}
            </ul>
            <p>Authenticated Users Online:</p>
            <ul>
              { this.state.authUsers.map ( x => <li>{x.socketId}</li>)}
            </ul>
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