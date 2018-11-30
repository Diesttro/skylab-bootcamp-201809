import React, { Component } from 'react'
import './ViewUser.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class ViewUser extends Component {
  state = { 
    data: null,
    followed: 0
  }

  componentWillMount = async () => {
    try {
      const data = await logic.getUserDataByUsername(this.props.match.params.username)
      
      this.setState(data)
    } catch (error) {
      alert(error)
    }
  }

  update = async () => {
    try {
      const data = await logic.getUserDataByUsername(this.props.match.params.username)
      
      this.setState({ ...data, followed: ++this.state.followed })
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar path={this.props.match.path.replace('/:username', '')} user={this.state.data} {...this.props} update={this.update} />
              <Main path={this.props.match.path.replace('/:username', '')} user={this.props.match.params.username} followed={this.state.followed} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ViewUser