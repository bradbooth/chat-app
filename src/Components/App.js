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
      value: "",
      chat: ""
    };
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  
  handleKeyDown = (e) => {
    if ( e.key === 'Enter' ){
      socket.emit('chat message', this.state.value)
      this.setState({
        value: ""
      })
    }
  }

  render() {



    return (
      <div style={{ textAlign: "center" }}>
        <input 
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
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