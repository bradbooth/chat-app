import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Route,
    Redirect
} from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export class PrivateRoute extends Component {
  
    render(){
  
        const { children, ...rest } = this.props
        return (
            <Route
                {...rest}
                render={({ location }) =>
                this.props.authentication.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
                }
            />
        )
    }
}

const mapStateToProps = state => {
    return { authentication: state.authentication };
};

export default connect(mapStateToProps)(PrivateRoute)