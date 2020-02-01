import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import history from '../History/History';
import PrivateRoute from './PrivateRoute'

import Chat from '../Components/Chat/Chat'
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Auth from './Auth'

class AppRouter extends Component {

  signOut = () => {
    localStorage.setItem('token', '')
    Auth.setAuthenticated(false)
    history.push('/login')
  }

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
            <li>
              <a href="/login" onClick={this.signOut}>signout</a>
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

const mapStateToProps = state => {
  return { authentication: state.authentication };
};

export default connect(mapStateToProps)(AppRouter)