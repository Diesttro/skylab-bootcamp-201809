import React from 'react'
import './Landing.css'
import logo from '../../logo.svg'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

function Landing(props) {
  return (
    <Container className="landing mt-5">
      <Row>
        <Col className="my-5 text-center">
          <img className="logo mb-3" src={logo} />
          <h1 className="text-center">Cuve</h1>
        </Col>
      </Row>
      <Row>
        <Col className="mt-2 mb-4">
          <h3 className="text-center">Discover what other people are talking about</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link className="btn btn-primary d-block mr-auto ml-auto mt-3 mb-2" to="/sign-up">Sign Up</Link>
          <Link className="btn btn-outline-primary d-block mr-auto ml-auto my-2" to="/sign-in">Sign In</Link>
        </Col>
      </Row>
    </Container>
  )
}

export default Landing