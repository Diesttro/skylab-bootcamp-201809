import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import logic from './logic'


class App extends Component {
    state = { register: false, login: false, home: false }

    handleRegister = () => {
        this.setState({ register: true })
    }

    handleLogin = () => {
        this.setState({ login: true })
    }

    handleRegisterClick = (name, surname, username, password) => {
        logic.registerUser(name, surname, username, password)
    }

    handleLoginClick = (username, password) => {
        
        if (logic.loginUser(username, password)===true) {
            this.setState({home:true})
            
        }
    
        
    }
    
    handleLogoutClick = () =>{
        logic.logout()
        }

    render() {
        return <div>
            {!this.state.register && !this.state.login && <section><button onClick={this.handleRegister}>Register</button> or <button onClick={this.handleLogin}>Login</button></section>}
            {this.state.register && <Register onRegisterClick={this.handleRegisterClick} />}
            {this.state.login && <Login onLoginClick={this.handleLoginClick} onLogoutClick={this.handleLogoutClick}/>}
            {this.state.home && <Home />}
        </div>
    }
}

export default App