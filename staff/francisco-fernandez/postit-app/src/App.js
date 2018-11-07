import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Postits from './components/Postits'
import Error from './components/Error'
import logic from './logic'


class App extends Component {
    state = { register: false, login: false, userId: null/*this.getUserId()*/, error: null }

    // getUserId() {
    //     const userId = sessionStorage.getItem('userId')

    //     return userId ? parseInt(userId) : null
    // }

    handleRegisterClick = () => {
        this.setState({ register: true })
    }

    handleLoginClick = () => {
        this.setState({ login: true })
    }

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() => this.setState({ login: true, register: false, error: null }))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.authenticate(username, password)
                .then(({id, token}) => {
                    sessionStorage.setItem('userId', id)
                    sessionStorage.setItem('token', token)
                    
                    this.setState({ userId: id, token, login: false, register: false, error: null })
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogoutClick = () => {
        this.setState({ userId: null })

        sessionStorage.removeItem('userId')
    }

    render() {
        const { register, login, userId, token, error } = this.state

        return <div>
            {!register && !login && !userId && <section><button onClick={this.handleRegisterClick}>Register</button> or <button onClick={this.handleLoginClick}>Login</button></section>}
            {register && <Register onRegister={this.handleRegister} />}
            {login && <Login onLogin={this.handleLogin} />}
            {error && <Error message={error} />}
            {userId && <section><button onClick={this.handleLogoutClick}>Logout</button></section>}
            {userId && <Postits userId={userId} token={token} />}
        </div>
    }
}

export default App
