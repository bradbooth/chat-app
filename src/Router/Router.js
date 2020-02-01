import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import history from '../History/History';
import PrivateRoute from './PrivateRoute'

import AnonChat from '../Components/Chat/AnonChat'
import AuthChat from '../Components/Chat/AuthChat'
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Auth from '../Auth/Auth'

class AppRouter extends Component {

  signOut = () => {
    Auth.signOut()
  }

  render() {

    const { isAuthenticated} = this.props.authentication

    return (
      <Router history={history} >
        <nav>
          <ul>
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="/signup">signup</Link>
            </li>
            <li>
              <Link to="/chat"> anonymous chat</Link>
            </li>
            { isAuthenticated &&
              <div>
                <li>
                  <Link to="/authchat">authenticated chat</Link>
                </li>
                <li>
                  <a href="/login" onClick={this.signOut}>signout</a>
                </li>
              </div>
            }
          </ul>
        </nav>

        <Switch >
          <PrivateRoute path="/authchat">
            <AuthChat />
          </PrivateRoute>
          <Route path="/chat">
            <AnonChat />
          </Route>
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