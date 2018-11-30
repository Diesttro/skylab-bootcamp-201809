import React, { Component } from 'react'
import './ViewThread.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class ViewThread extends Component {
  state = { 
    data: null
  }

  componentWillMount = async () => {
    if (logic.loggedIn) {
      try {
        const data = await logic.getUserData()

        this.setState(data)
      } catch (error) {
        alert(error)
      }
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar path={this.props.match.path.replace('/:id', '')} user={this.state.data} />
              <Main path={this.props.match.path.replace('/:id', '')} thread={this.props.match.params.id} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ViewThread