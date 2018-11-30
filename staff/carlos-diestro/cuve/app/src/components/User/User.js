import React, { Component } from 'react'
import './User.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Redirect, Link } from 'react-router-dom'
import logic from '../../logic'

class User extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    if (this.props.user !== prevProps.user) {
      this.setState(this.props.user)
    }
  }

  followLink = id => {
    let link

    if (this.state.id === logic._user.id) {
      link = <button type="button" className="btn btn-primary" onClick={() => this.handleEditClick(id)}>Edit profile</button>
    } else {
      const followed = this.state.followers.find(follower => logic._user.id === follower)
      const pending = this.state.pending.find(follower => logic._user.id === follower)

      if (followed) link = <button type="button" className="btn btn-primary" onClick={() => this.handleUnfollowClick(id)}>Unfollow</button>
      else if (pending) link = <button type="button" className="btn btn-primary" onClick={() => this.handleUnfollowClick(id)}>Unfollow</button>
      else link = <button type="button" className="btn btn-primary" onClick={() => this.handlefollowClick(id)}>Follow</button>
    }

    return link
  }

  handleEditClick = () => {
    this.props.history.push('/profile/edit')
  }

  handlefollowClick = async id => {
    try {
      const res = await logic.follow(this.state.username)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  handleUnfollowClick = async id => {
    try {
      const res = await logic.unfollow(this.state.username)

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
          <div className="row">
            <div className="col my-2 text-center"><img className="avatar" src="https://via.placeholder.com/80x80.png?text=+" alt="avatar" /></div>
            <div className="w-100"></div>
            <div className="col"><strong>{this.state.fullname}</strong></div>
            <div className="w-100"></div>
            <div className="col">@{this.state.username}</div>
            <div className="w-100"></div>
            <div className="col my-2">{new Date(this.state.signed).toLocaleString()}</div>
            <div className="w-100"></div>
            {logic.loggedIn && this.state.username && <div className="col my-2 text-center">
              {this.followLink(this.state.username)}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default User