import React, { Component } from 'react'
import './App.css'
import { Switch, Route, withRouter } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import NotFound from './components/NotFound/NotFound'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/sign-in" component={SignIn} />
        {/* <Route path="/(home|user|thread)/" component={Navbar} />
        <Route path="/home" component={Home} />
        <Route path="/user" component={User} />
        <Route path="/thread" component={Thread} /> */}
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(App);
