import React, { Component } from "react";
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
            console.log('submitting')
            axios.post('/api/login', {
                username: this.state.username,
                password: this.state.password
            }).then( res => {
                console.log(res)
                this.setState({
                    username: '',
                    password: '',
                    loggedIn: res.data.valid
                })
            }).catch( err => {
                console.log(err)
            })
        }
    }

    render() {
        return (
            <div >
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
                { this.state.loggedIn && <p>Successfully logged in</p>}       
            </div>
        )
    }
}

export default Login;