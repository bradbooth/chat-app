import React, { Component } from "react";
import { connect } from "react-redux";
import { updateToken } from "../../Redux/Actions/auth"
import { updateUser } from "../../Redux/Actions/user"
import history from '../../History/History';
import Auth from '../../Auth/Auth'

const axios = require('axios').default;

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false
        }
    }

    setUsername = (e) => {
        this.setState({ username: e.target.value })
    }

    setPassword = (e) => {
        this.setState({ password: e.target.value })
    }

    submit = (e) => {
        if ( e.key === 'Enter' ){
            axios.post('/api/login', {
                username: this.state.username,
                password: this.state.password
            }).then( res => {

                // localStorage.setItem('token', res.data.token)
                this.props.updateToken(res.data.token)

                Auth.authenticate( () => {
                    console.log("Error logging in")
                }, () => {
                    console.log('Authenticated... redirecting')

                    this.props.updateToken(res.data.token)
                    this.props.updateUser({...res.data.user})

                    history.push('/authchat')
                })
            }).catch( err => {
                console.log(err)
            })
        }
    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
            <h1>Log in</h1>
                <label htmlFor="username">Username</label>
                <input 
                    type="text"
                    id="username"
                    value={this.state.username}
                    onChange={this.setUsername}
                />
                <br/>
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.setPassword}
                    onKeyDown={this.submit}
                />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateToken: (token) => dispatch(updateToken(token)),
    updateUser: (user) => dispatch(updateUser(user))
});

export default connect(null, mapDispatchToProps)(Login);