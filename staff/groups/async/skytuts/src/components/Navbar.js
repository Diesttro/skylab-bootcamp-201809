import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

import template from './templates/Navbar.pug'; 

import logicAuth from '../logic/auth'


class Navbar extends Component  {

    
    render() {

    let logout = (<a href='./' onClick={() => logicAuth.logout()}>Logout</a>)

    return template.call(this, {        
        authenticated: logicAuth.isAuthenticated(),
        user: logicAuth._user,
        logout,
        NavLink
      });

    }

}

export default Navbar