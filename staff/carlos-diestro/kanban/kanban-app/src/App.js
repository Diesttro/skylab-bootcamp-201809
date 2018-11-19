import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Postits from './components/Postits'
import Error from './components/Error'
import Landing from './components/Landing'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = 'http://localhost:5000/api'

class App extends Component {
    state = {
        friends: [],
        load: false,
        error: null
    }

    componentDidMount(prevProps) {
        if (logic._userId) {
            logic.retrieveUser()
                .then(user => { 
                    this.setState({ friends: user.friends, load: true, avatar: user.avatar })
                })
        }
        // TODO error handling!
    }

    componentDidUpdate(prevProps) {
        if (logic._userId && !this.state.load) {
            logic.retrieveUser()
                .then(user => { 
                    this.setState({ friends: user.friends, load: true, avatar: user.avatar })
                })
        }
        // TODO error handling!
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
            logic.login(username, password)
                .then(() =>  this.props.history.push('/postits'))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogoutClick = () => {
        logic.logout()
        this.setState({ load: false })
        this.props.history.push('/')
    }

    handleGoBack = () => this.props.history.push('/')

    handleAddFriend = event => {
        event.preventDefault()

        const username = event.target[0].value
        
        try {
            logic.addFriend(username)
                .then(res => logic.retrieveUser().then(user => { this.setState({ friends: user.friends }) }))
                .catch(err => console.log(err))
        } catch(err) {
            console.log(err)
        }
    }

    handleRemoveFriend = event => {
        event.preventDefault()

        const username = event.target[0].value
        
        try {
            logic.removeFriend(username)
                .then(res => logic.retrieveUser().then(user => { this.setState({ friends: user.friends }) }))
                .catch(err => console.log(err))
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        const { error } = this.state

        return <div>
            <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/postits" />} />
            <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            {error && <Error message={error} />}

            <Route path="/postits" render={() => logic.loggedIn ? <div>
                <section>
                    <button type="button" onClick={this.handleLogoutClick} style={{ float: "left" }}>Logout</button>
                    <form onSubmit={this.handleAddFriend} style={{ textAlign: "right" }}>
                        <input type="text" name="friend" placeholder="Write username to add" />
                        <button type="submit">Add Friend</button>
                    </form>
                    <form onSubmit={this.handleRemoveFriend} style={{ textAlign: "right" }}>
                        <input type="text" name="friend" placeholder="Write username to remove" />
                        <button type="submit">Remove Friend</button>
                    </form>
                </section>
                <Postits friends={this.state.friends} avatar={this.state.avatar} />
            </div> : <Redirect to="/" />} />

        </div>
    }
}

export default withRouter(App)
