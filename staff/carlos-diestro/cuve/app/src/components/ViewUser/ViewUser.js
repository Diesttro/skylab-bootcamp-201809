import React, { Component } from 'react'
import './ViewUser.css'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class ViewUser extends Component {
  state = {
    flag: false
  }

  componentDidMount = async () => {
    try {
      if (logic.isLoggedIn) {
        const user = await logic.getUserData()
        const viewUser = await logic.getUserDataByUsername(this.props.match.params.username)
      
        this.setState({ user: user, viewUser: viewUser })
      } else {
        const viewUser = await logic.getUserDataByUsername(this.props.match.params.username)
      
        this.setState({ viewUser: viewUser })
      }
    } catch (error) {
      alert(error)
    }
  }

  componentDidUpdate = async prevProps => {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      try {
        const viewUser = await logic.getUserDataByUsername(this.props.match.params.username)
        
        this.setState({ viewUser: viewUser })
      } catch (error) {
        alert(error)
      }
    }
  }

  update = async () => {
    try {
      const viewUser = await logic.getUserDataByUsername(this.props.match.params.username)
  
      this.setState({ viewUser: viewUser, flag: !this.state.flag })
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Navbar {...this.props} user={this.state.user} />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar {...this.props} user={this.state.viewUser} update={this.update} />
              <Main {...this.props} user={this.state.viewUser} update={this.update} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ViewUser