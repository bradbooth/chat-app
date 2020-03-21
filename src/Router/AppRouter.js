import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom"
import {
  Router,
  Switch,
  Route,
} from "react-router-dom";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import history from '../History/History';
import PrivateRoute from './PrivateRoute'

import AnonChat from '../Components/Chat/AnonChat'
import AuthChat from '../Components/Chat/AuthChat'
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Auth from '../Auth/Auth'
import Home from '../Components/Home/Home'

import './AppRouter.css'; 

class AppRouter extends Component {

  signOut = () => {
    Auth.signOut()
  }

  render() {

    const { isAuthenticated} = this.props.authentication

    return (
      <Router history={history} basename='/project7'>

        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">EECS 4481 - Chat App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavItem>
                <NavLink to="/login" className="nav-link">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/signup" className="nav-link">Sign up</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/chat" className="nav-link">Chat</NavLink>
              </NavItem>
              {/* <Nav.Link href="/signup">Sign up</Nav.Link>
              <Nav.Link href="/chat">Chat</Nav.Link> */}
              { isAuthenticated && <NavItem><NavLink to="/authchat" className="nav-link">Authenticated Chat</NavLink></NavItem>}
              { isAuthenticated && <NavItem><NavLink to="/login" className="nav-link" onClick={this.signOut}>Sign out</NavLink></NavItem> }
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
          <Route path="/">
            <Home />
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