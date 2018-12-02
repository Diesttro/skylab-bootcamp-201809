import React, { Component } from 'react'
import './Search.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Search extends Component {
  state = {
    flag: false
  }

  // componentDidMount = async () => {
  //   try {
  //     const user = await logic.getUserDataByUsername(this.props.match.params.username)
      
  //     this.setState({ user: user })
  //   } catch (error) {
  //     alert(error)
  //   }
  // }

  // update = async () => {
  //   try {
  //     const user = await logic.getUserDataByUsername(this.props.match.params.username)
      
  //     this.setState({ user: user, flag: !this.state.flag })
  //   } catch (error) {
  //     alert(error)
  //   }
  // }

  render() {
    return (
      <div className="wrapper">
        <Navbar {...this.props} />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar {...this.props} />
              <Main {...this.props} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Search