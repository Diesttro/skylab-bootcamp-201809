import React, { Component } from 'react';
import PostIt from '../postit/'

class Register extends Component {

    constructor() {
        super();

        this.state = {
            registred: false,
            logged: false,
            login: false,
            name: '',
            email: '',
            password: '',
        }
    }

    setName = event => this.setState({ name: event.target.value });
    setEmail = event => this.setState({ email: event.target.value });
    setPassword = event => this.setState({ password: event.target.value });

    authUser = () => {
        this.setState({ registred: true, logged: true, login: false });
    };

    showLogin = () => {
        this.setState({ login: true });
    };

    render() {
        return <div className="lists">
                {!this.state.registred && !this.state.logged && !this.state.login  &&
                    <div>
                        <h4>Register</h4>
                        <input placeholder="name" value={this.state.name} type="text"  onChange={this.setName}/>
                        <input placeholder="email" value={this.state.email} type="email"  onChange={this.setEmail}/>
                        <input placeholder="password" value={this.state.password} type="password"  onChange={this.setPassword}/>
                        <button onClick={this.authUser}>Register</button>
                        <button onClick={this.showLogin}>¿Ya tienes cuenta?</button>
                    </div>
                }
                {this.state.registred && this.state.logged && !this.state.login &&
                    <div className="lists-fix">
                         <PostIt title="TODO"/>
                    </div>
                }
                {this.state.login &&
                    <div>
                        <h4>Login</h4>
                        <input placeholder="email" value={this.state.email} type="email"  onChange={this.setEmail}/>
                        <input placeholder="password" value={this.state.password} type="password"  onChange={this.setPassword}/>
                        <button onClick={this.authUser}>Register</button>
                    </div>
                }
        </div>
    }
}

export default Register;