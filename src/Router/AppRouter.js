import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Router,
  Switch,
  Route,
} from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

import history from '../History/History';
import PrivateRoute from './PrivateRoute'

import AnonChat from '../Components/Chat/AnonChat'
import AuthChat from '../Components/Chat/AuthChat'
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Auth from '../Auth/Auth'

import './AppRouter.css'; 


class AppRouter extends Component {

  signOut = () => {
    Auth.signOut()
  }

  render() {

    const { isAuthenticated} = this.props.authentication

    return (
      <Router history={history} >
        {/* <nav>
          <ul id="horizontal-list">
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
        </nav> */}
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">EECS 4481 - Chat App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Sign up</Nav.Link>
              <Nav.Link href="/chat">Chat</Nav.Link>
              { isAuthenticated && <Nav.Link href="/authchat">Authenticated Chat</Nav.Link> }
              { isAuthenticated && <Nav.Link href="/login" onClick={this.signOut}>Sign out</Nav.Link> }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

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