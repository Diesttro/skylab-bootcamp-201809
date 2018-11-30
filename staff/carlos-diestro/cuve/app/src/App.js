import React, { Component } from 'react'
import './App.css'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import ViewUser from './components/ViewUser/ViewUser'
import ViewThread from './components/ViewThread/ViewThread'
import NotFound from './components/NotFound/NotFound'
import logic from './logic'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => logic.loggedIn ? <Redirect to="/home" /> : <Landing />} />
        <Route exact path="/sign-up" render={props => logic.loggedIn ? <Redirect to="/home" /> : <SignUp {...props} />} />
        <Route exact path="/sign-in" render={props => logic.loggedIn ? <Redirect to="/home" /> : <SignIn {...props} />} />
        {/* <Route path="/(home|user|thread)/" component={Navbar} /> */}
        <Route exact path="/home" render={props => logic.loggedIn ? <Home {...props} /> : <Redirect to="/" /> } />
        <Route path="/user/:username" component={ViewUser} />
        <Route path="/thread/:id" component={ViewThread} />
        <Route path="/profile" render={props => logic.loggedIn ? <Profile {...props} /> : <Redirect to="/" /> } />
        <Route path="/profile/edit" render={props => logic.loggedIn ? <Profile {...props} /> : <Redirect to="/" /> } />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(App);
