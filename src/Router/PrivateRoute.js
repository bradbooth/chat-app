import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Redirect
} from "react-router-dom";

import Auth from './Auth'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export class PrivateRoute extends Component {
    constructor(props) {
      super(props);
  
      this.authenticate = this.authenticate.bind(this)
  
      this.state = {
            isLoading: true,
            isAuthenticated: false,
          }
      }
  
      authenticate = () => {
        if ( Auth.isAuthenticated() ){
          this.setState({
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          this.setState({
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
  
      componentDidMount(){
        this.authenticate()
        // setInterval( () => {
        //   this.authenticate()
        // }, 30 * 1000)
      }
  
    render(){
  
      const { isAuthenticated, isLoading } = this.state
      const { location } = this.props
      
      if ( isLoading ){
        return <div></div>
      } else if ( !isAuthenticated ){
        return <Redirect to={{ pathname: "/login", state: { from: location } }}/>
      } else {
        return this.props.children
      }
  
    }
}

export default connect()(PrivateRoute)