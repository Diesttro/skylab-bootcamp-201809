import React, { Component } from 'react'
import './ViewChat.css'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class ViewChat extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  update = chat => {
    this.setState({ chat })
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar {...this.props} user={this.state.user} />
        <section className="home">
          <div className="container">
            <div className="row">
              <Sidebar {...this.props} user={this.state.user} update={this.update} />
              <Main {...this.props} user={this.state.user} update={this.update} chat={this.state.chat} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ViewChat