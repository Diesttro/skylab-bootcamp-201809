import React, { Component } from 'react'
import './Profile.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Profile extends Component {
  state = { }

  componentWillMount = async () => {
    const data = await logic.getUserData()

    this.setState(data)
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.render()
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar path={this.props.location.pathname} user={this.state.data} {...this.props} />
              <Main path={this.props.location.pathname} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Profile