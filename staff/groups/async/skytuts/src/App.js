import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Info from './components/Info'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import logicAuth from './logic/auth'

import './App.css'


class App extends Component {

  render() {
    return (
      <BrowserRouter>

        <div className="App">

        <Switch>
          {logicAuth.isAuthenticated &&
            <Route path="/course/:slug?" component={Info} />
          }
          {logicAuth.isAuthenticated &&
            <Route path="/profile" component={Profile} />
          }
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>

        </div>

      </BrowserRouter>
    )
  }
}

export default App;

