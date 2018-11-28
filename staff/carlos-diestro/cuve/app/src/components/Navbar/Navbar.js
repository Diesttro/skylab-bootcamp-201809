import React, { Component } from 'react'
import './Navbar.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Navbar extends Component {
  state = { }

  componentWillUpdate() {
    debugger
  }

  handleClickSignOut = event => {
    logic.signOut()
  }

  render() {
    return (
      <header>
        <Container>
          <Row>
            <Col className="col-2 text-left">
            <Link to="/home"><img className="logo img-fluid" src={logo} /></Link>
            </Col>
            <Col>
              <Input type="text" name="search" className="form-control" placeholder="Search people..." />
            </Col>
            <Col className="col-5 d-flex justify-content-end align-items-center">
              <nav className="mr-4">
                <a href="#" className="mr-1">MESSAGES</a><span className="count">3</span>
                <a href="#" className="mr-1 ml-2">NOTIFICATIONS</a><span className="count">1</span>
                <Link to="/" className="mr-1 ml-2" onClick={this.handleClickSignOut}>SIGN OUT</Link>
              </nav>
              <Link to="/profile"><img className="logo img-fluid" src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/1809/s300/skylab-coders-academy-logo.jpg" /></Link>
            </Col>
          </Row>
        </Container>
      </header>
    )
  }
}

export default Navbar