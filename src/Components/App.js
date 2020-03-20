import React, { Component } from "react";
import AppRouter from '../Router/AppRouter'

class App extends Component {

  render() {
    console.log("Did it work?")
    return (
      <div>
        <AppRouter />
      </div>
    )
  }
}
export default App;