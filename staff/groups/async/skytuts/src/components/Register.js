import React, { Component } from 'react'

import { NavLink } from 'react-router-dom'
import Navbar from './Navbar'

import logicAuth from '../logic/auth'

class Register extends Component {

    state = { name: '', surname: '', username: '', password: '', error: null }


    componentWillMount() {
        if (sessionStorage.getItem('userId') || sessionStorage.getItem('token') ) this.props.history.push('/')
    }

    handleRegister = (name, surname, username, password) => {
        try {
            logicAuth.registerUser(name, surname, username, password)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/login'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
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

        const { name, surname, username, password } = this.state

        this.handleRegister(name, surname, username, password)
    }

    render() {
        return (
            <div>
            <Navbar />
            <div className="register-container">

                <div className="register-title">
                    <h1><b>Register</b></h1>
                </div>

                
                    <form className="register-form" onSubmit={this.handleSubmit}>
                <div className="register-inputs">
                    <input type="text" placeholder="Name" className="register-input" onChange={this.handleNameChange} />
                    <input type="text" placeholder="Surname" className="register-input" onChange={this.handleSurnameChange} />
                    <input type="text" placeholder="Username" className="register-input" onChange={this.handleUsernameChange} />
                    <input type="password" placeholder="Password" className="register-input" onChange={this.handlePasswordChange} />
                    <button type="submit" className="register-btn">Register</button>
                </div>
                <div className="goto-login">
                    <NavLink to="/login">Already have an account? Login here!</NavLink>
                </div>
                    </form>
                    
                    {this.state.error &&
                        <div className="register-error-container"><p className="register-error-message">{this.state.error}</p></div>
                    }
                    
                
            </div>
        </div>
        )
    }
}

export default Register