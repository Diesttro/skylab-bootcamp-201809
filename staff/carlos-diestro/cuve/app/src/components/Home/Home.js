import React, { Component } from 'react'
import './Home.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Home extends Component {
  state = { }

  componentDidMount = async () => {
    if (!logic._user) return this.props.history.push('/')

    const user = await logic.getUserData()

    this.setState(user)
  }

  render() {

    return (
      <Container>
        <Row>
          Hello World
        </Row>
      </Container>
    )
  }
}

export default Home