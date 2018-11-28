import React, { Component } from 'react'
import './Sidebar.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Trend from '../Trend/Trend'
import PopularPeople from '../PopularPeople/PopularPeople'
import User from '../User/User'
import logic from '../../logic'

class Sidebar extends Component {
  state = { }

  loadComponents = () => {
    let components

    switch(this.props.path) {
      case '/home':
        components = <div className="col-4">
          <Trend />
          <PopularPeople />
        </div>
        break
      case '/profile':
        components = <div className="col-4">
          <User user={this.props.user} />
        </div>
        break
    }

    return components
  } 

  render() {

    return this.loadComponents()
  }
}

export default Sidebar