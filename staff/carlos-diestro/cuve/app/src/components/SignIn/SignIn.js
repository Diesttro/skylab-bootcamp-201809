import React, { Component } from 'react'
import './SignIn.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class SignIn extends Component {
  state = {}
  
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

  handleSubmit = event => {
    event.preventDefault()

    logic.signUp(
      this.state.username,
      this.state.password
    )

    // this.props.history.push('/home')
  }

  render() {
    return (
      <Container className="my-3">
        <Row>
          <Col className="mt-2 mb-4">
            <img className="logo mb-3" src={logo} />
          </Col>
        </Row>
        <Form className="signin" onSubmit={this.handleSubmit}>
          <Row form className="justify-content-center">
            <Col className="inputs">
              <h3 className="mb-3">Sign In Form</h3>
              <Input type="text" name="username" placeholder="Username" onChange={this.handleChange} />
              <Input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
              <Row className="justify-content-between align-items-center mt-3">
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