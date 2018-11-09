import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from './Navbar'

import logicAuth from '../logic/auth'


class Login extends Component {

    state = { username: '', password: '', error: null }


    componentWillMount() {
        if (sessionStorage.getItem('userId') || sessionStorage.getItem('token')) this.props.history.push('/')
    }

    handleLogin = (username, password) => {
        try {
            logicAuth.login(username, password)
                .then(() => logicAuth.getUser().then(() => this.props.history.push('/')))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.handleLogin(username, password)
    }

    render() {
        return (
        <div>
            <Navbar />
            <div className="login-container">

                <div className="login-title">
                    <h1>Login</h1>
                </div>

                
                    <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="login-inputs">
                        <input type="text" placeholder="Username" className="login-input" onChange={this.handleUsernameChange} />
                        <input type="password" placeholder="Password" className="login-input" onChange={this.handlePasswordChange} />
                        <button type="submit" className="login-btn">Login</button>
                    </div>
                    <div className="goto-register">
                        <NavLink to="/register">Don't have an account? Sign up here</NavLink>
                    </div>
                    </form>
                    {this.state.error &&
                         <div className="login-error-container"><p className="login-error-message">{this.state.error}</p></div>
                    }
            </div>  
        </div>
        )
    }
}

export default Login