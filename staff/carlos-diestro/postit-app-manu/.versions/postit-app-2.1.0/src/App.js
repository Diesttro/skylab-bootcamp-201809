import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Postits from './components/Postits'
import Error from './components/Error'
import Landing from './components/Landing'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'


class App extends Component {
    state = { userId: this.getUserId(), token: this.getToken(), error: null }

    getUserId() {
        const userId = sessionStorage.getItem('userId')

        return userId ? userId : null
    }

    getToken() {
        const token = sessionStorage.getItem('token')

        return token ? token : null
    }

    handleRegisterClick = () => this.props.history.push('/register')

    handleLoginClick = () => this.props.history.push('/login')

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/login'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.authenticate(username, password)
                .then(({ id, token }) => {
                    sessionStorage.setItem('userId', id)
                    sessionStorage.setItem('token', token)

                    this.setState({ userId: id, token, error: null }, () => this.props.history.push('/postits'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogoutClick = () => {
        sessionStorage.removeItem('userId')

        this.setState({ userId: null, token: null }, () => this.props.history.push('/'))
    }

    handleGoBack = () => this.props.history.push('/')

    render() {
        const { userId, token, error } = this.state

        return <div>
            <Route exact path="/" render={() => !userId ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/postits" />} />
            <Route path="/register" render={() => !userId ? <Register onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            <Route path="/login" render={() => !userId ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            {error && <Error message={error} />}

            <Route path="/postits" render={() => userId ? <div>
                <section><button onClick={this.handleLogoutClick}>Logout</button></section>
                <Postits userId={userId} token={token} />
            </div> : <Redirect to="/" />} />

        </div>
    }
}

export default withRouter(App)
