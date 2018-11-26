import React, { Component } from 'react'
import './SignIn.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class SignIn extends Component {
  state = {
    username: '',
    password: '',
    error: null
  }

  handleChange = event => {
    const input = event.target

    switch (input.name) {
      case 'username':
        this.setState({ username: input.value })
        break
      case 'password':
        this.setState({ password: input.value })
        break
    }
  }

  handleSubmit = async event => {
    event.preventDefault()

    try {
      const res = await logic.signIn(
        this.state.username,
        this.state.password
      )

      this.props.history.push('/home')
    } catch ({ message }) {
      this.setState({ error: message })
    }
  }

  render() {
    return (
      <Container className="my-5">
        <Row>
          <Col className="mt-5 mb-4">
            <img className="logo mb-3" src={logo} />
          </Col>
        </Row>
        <Form className="signup" onSubmit={this.handleSubmit}>
          <Row form className="justify-content-center">
            <Col className="inputs">
              <FormGroup className="my-2">
                <h3 className="mb-3">Sign In Form</h3>
                <Input type="text" name="username" placeholder="Username" onChange={this.handleChange} />
                <Input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
              </FormGroup>
              { this.state.error && <FormFeedback className="d-block my-1 text-center">{ this.state.error }</FormFeedback> }
              <Row className="justify-content-between align-items-center my-2">
                <Col>
                  <Link to="/">Back</Link>
                </Col>
                <Col className="text-right">
                  <Button color="primary">Sign In</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    )
  }
}

export default SignIn