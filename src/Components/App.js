import React, { Component } from "react";
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:4001'
var socket;

class App extends Component {

  constructor() {
    super();

    socket = io(ENDPOINT)
    socket.on('chat message', (msg) => {
      this.setState({
        chat: this.state.chat + " " + msg
      })
    })

    this.state = {
      user: "",
      to: "",
      value: "",
      chat: ""
    };
  }

  componentDidMount = () => {
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
        from: this.state.user,
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
      socket.emit('clientJoined', this.state.user)
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
        <p>user:</p>
        <input 
          type="text"
          value={this.state.user}
          onChange={this.setUser}
          onKeyDown={this.sendUser}
        />
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
    )
  }
}
export default App;