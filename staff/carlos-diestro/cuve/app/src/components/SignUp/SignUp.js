import React, { Component } from 'react'
import './SignUp.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class SignUp extends Component {
  state = {
    fullname: '',
    username: '',
    email: '',
    password: '',
    repassword: ''
  }

  handleChange = event => {
    const input = event.target

    switch (input.name) {
      case 'fullname':
        this.setState({ fullname: input.value })
        break
      case 'username':
        this.setState({ username: input.value })
        break
      case 'email':
        this.setState({ email: input.value })
        break
      case 'password':
        this.setState({ password: input.value })
        break
      case 'repassword':
        this.setState({ repassword: input.value })
        break
    }
  }

  handleSubmit = async event => {
    event.preventDefault()

    try {
      const res = await logic.signUp(
        this.state.fullname,
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.repassword
      )

      this.props.history.push('/')
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
                <h3 className="mb-3">Sign Up Form</h3>
                <Input type="text" name="fullname" placeholder="Full name" onChange={this.handleChange} />
                <Input type="text" name="username" placeholder="Username" onChange={this.handleChange} />
                <Input type="text" name="email" placeholder="Email" onChange={this.handleChange} />
                <Input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                <Input type="password" name="repassword" placeholder="Repeat password" onChange={this.handleChange} />
              </FormGroup>
              { this.state.error && <FormFeedback className="d-block my-1 text-center">{ this.state.error }</FormFeedback> }
              <Row className="justify-content-between align-items-center my-2">
                <Col>
                  <Link to="/">Back</Link>
                </Col>
                <Col className="text-right">
                  <Button color="primary">Sign Up</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    )
  }
}

export default SignUp