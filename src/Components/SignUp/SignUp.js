import React, { Component } from "react";
import history from '../../History/History';

const axios = require('axios').default;

export class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
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
            axios.post('/api/createUser', {
                username: this.state.username,
                password: this.state.password
            }).then( res => {
                history.push('/login')
            }).catch( err => {
                console.log(err)
            })
        }
    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
            <h1>Sign up</h1>
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

export default SignUp;