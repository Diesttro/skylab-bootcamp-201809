import React, { Component } from 'react'
import './Home.css'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Home extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  update = () => {
    this.forceUpdate()
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar {...this.props} user={this.state.user} />
        <section className="home">
          <div className="container">
            <div className="row">
              <Sidebar {...this.props} user={this.state.user} />
              <Main {...this.props} user={this.state.user} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Home