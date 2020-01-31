import React, { Component } from "react";
import {
  Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import history from '../History/History';

import Chat from '../Components/Chat/Chat'
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Auth from './Auth'

export default class AppRouter extends Component {
    render() {

      return (
        <Router history={history} >
          <nav>
            <ul>
              <li>
                <Link to="/login">login</Link>
              </li>
              <li>
                <Link to="/chat">chat</Link>
              </li>
              <li>
                <Link to="/signup">signup</Link>
              </li>
            </ul>
          </nav>

          <Switch >
            <PrivateRoute path="/chat">
              <Chat />
            </PrivateRoute>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>

        </Router>
      )
    }
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
class PrivateRoute extends Component {
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