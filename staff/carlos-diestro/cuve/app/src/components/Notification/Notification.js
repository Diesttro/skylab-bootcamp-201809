import React, { Component } from 'react'
import './Notification.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Notification extends Component {
  state = {
    flag: false
  }

  componentDidMount = async () => {
    try {
      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar {...this.props} user={this.state.user} />
        <section className="home">
          <div className="container">
            <div className="row">
              <Sidebar {...this.props} />
              <Main {...this.props} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Notification