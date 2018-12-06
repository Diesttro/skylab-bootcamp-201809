import React, { Component } from 'react'
import './Navbar.css'
import logo from '../../logo.svg'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Navbar extends Component {
  state = {}
  
  componentDidMount = () => {
    if (this.props.user && this.props.user.pending.length) {
      this.setState({ notifications: this.props.user.pending.length })
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.user !== prevProps.user && this.props.user.pending.length) {
      this.setState({ notifications: this.props.user.pending.length })
    }
  }

  handleChange = event => {
    this.setState({ search: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()

    this.props.history.push(`/search/${this.state.search}`)
  }

  handleClickSignOut = event => {
    logic.signOut()
  }

  loadComponent = () => {
    if (logic.isLoggedIn) {
      return (
        <div className="row">
          <div className="col-lg-2 text-left">
            <Link to="/home"><img className="logo img-fluid" src={logo} /></Link>
          </div>
          <div className="col">
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="search" className="form-control" placeholder="Search people..." onChange={this.handleChange} />
            </form>
          </div>
          <div className="col-lg-5 d-flex justify-content-end align-items-center">
            <nav className="mr-4">
              <Link to="/chats" className="mr-1">MESSAGES</Link>
              {/* <span className="count">3</span> */}
              <Link to="/notifications" className="mr-1 ml-2">NOTIFICATIONS</Link>
              {this.state.notifications && <span className="count">{this.state.notifications}</span>}
              <Link to="/" className="mr-1 ml-2" onClick={this.handleClickSignOut}>SIGN OUT</Link>
            </nav>
            {this.props.user && <Link to="/profile"><img className="logo img-fluid" src={logic.url + this.props.user.avatar} /></Link>}
          </div>
        </div>
      )
    } else {
      return (
        <div className="row">
          <div className="col-2 text-left">
            <Link to="/home"><img className="logo img-fluid" src={logo} /></Link>
          </div>
          <div className="col text-right">
            <Link to="/sign-up" className="btn btn-primary mr-2">Sign Up</Link>
            <Link to="/sign-in" className="btn btn-outline-primary">Sign In</Link>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <header>
        <div className="container">
          {this.loadComponent()}
        </div>
      </header>
    )
  }
}

export default Navbar