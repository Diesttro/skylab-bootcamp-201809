import React, { Component } from 'react'
import './App.css'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import Home from './components/Home/Home'
import Search from './components/Search/Search'
import Profile from './components/Profile/Profile'
import ViewUser from './components/ViewUser/ViewUser'
import ViewThread from './components/ViewThread/ViewThread'
import NotFound from './components/NotFound/NotFound'
import Notification from './components/Notification/Notification'
import ViewChat from './components/ViewChat/ViewChat'

import logic from './logic'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => logic.isLoggedIn ? <Redirect to="/home" /> : <Landing />} />
        <Route exact path="/sign-up" render={props => logic.isLoggedIn ? <Redirect to="/home" /> : <SignUp {...props} />} />
        <Route exact path="/sign-in" render={props => logic.isLoggedIn ? <Redirect to="/home" /> : <SignIn {...props} />} />
        <Route path="/home" render={props => logic.isLoggedIn ? <Home {...props} /> : <Redirect to="/" /> } />
        <Route path="/search/:username" component={Search} />
        <Route path="/user/:username" component={ViewUser} />
        <Route path="/thread/:id" component={ViewThread} />
        <Route path="/profile" render={props => logic.isLoggedIn ? <Profile {...props} /> : <Redirect to="/" /> } />
        <Route path="/edit" render={props => logic.isLoggedIn ? <Profile {...props} /> : <Redirect to="/" /> } />
        <Route path="/notifications" render={props => logic.isLoggedIn ? <Notification {...props} /> : <Redirect to="/" /> } />
        <Route path="/chats" render={props => logic.isLoggedIn ? <ViewChat {...props} /> : <Redirect to="/" /> } />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(App);
