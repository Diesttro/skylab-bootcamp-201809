import React, { Component } from 'react'
import './User.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Redirect, Link } from 'react-router-dom'
import logic from '../../logic'

class User extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    if (!!this.props.user === !prevProps.user) {
      if (logic.isLoggedIn && this.props.user.id === logic._user.id) return this.props.history.push('/profile')
      
      this.setState(this.props.user)
    }
  }

  profileLink = username => {
    let link

    if (this.props.user.id === logic._user.id) {
      link = <button type="button" className="btn btn-primary" onClick={() => this.handleEditClick(username)}>Edit profile</button>
    } else {
      const followed = this.props.user.followers.find(follower => logic._user.id === follower)

      if (followed) {
        link = <button type="button" className="btn btn-primary" onClick={() => this.handleUnfollowClick(username)}>Unfollow</button>
      } else {
        const pending = this.props.user.pending.find(follower => logic._user.id === follower)
        
        if (pending) {
          link = <button type="button" className="btn btn-primary" onClick={() => this.handleUnfollowClick(username)}>Unfollow</button>
        } else {
          link = <button type="button" className="btn btn-primary" onClick={() => this.handlefollowClick(username)}>Follow</button>
        }
      }
    }

    return link
  }

  handleEditClick = () => {
    this.props.history.push('/edit')
  }

  handlefollowClick = async username => {
    try {
      const res = await logic.follow(this.props.user.username)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  handleUnfollowClick = async username => {
    try {
      const res = await logic.unfollow(this.props.user.username)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return (
      <div>
        <h3 className="mb-3 font-weight-bold">Profile</h3>
        <div className="block">
          {this.props.user && <div className="row">
            <div className="col my-2 text-center">
              <img className="avatar" src={this.props.user.avatar} alt="avatar" />
            </div>
            <div className="w-100"></div>
            <div className="col">
              {this.props.user.fullname}
            </div>
            <div className="w-100"></div>
            <div className="col">
              @{this.props.user.username}
            </div>
            <div className="w-100"></div>
            <div className="col">
              {new Date(this.props.user.signed).toLocaleString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })}
              </div>
            <div className="w-100"></div>
            {logic.isLoggedIn && this.props.user && <div className="col my-2 text-center">
              {this.profileLink(this.props.user.username)}
            </div>}
          </div>}
        </div>
      </div>
    )
  }
}

export default User