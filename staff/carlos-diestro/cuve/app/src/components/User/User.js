import React, { Component } from 'react'
import './User.css'
import { Redirect, Link } from 'react-router-dom'
import logic from '../../logic'

class User extends Component {
  state = {}

  // componentDidUpdate = prevProps => {
  //   debugger
  //   if (!!this.props.user === !prevProps.user) {
  //     if (logic.isLoggedIn && this.props.user.id === logic._user.id) return this.props.history.push('/profile')
  //     debugger
  //     this.setState(this.props.user)
  //   }
  // }

  profileLink = username => {
    let link
    debugger

    if (this.props.user.id === logic._user.id) {
      link = <button type="button" className="btn btn-primary" onClick={this.handleEditClick}>Edit profile</button>
    } else if (this.props.user.private) {
      const pending = this.props.user.pending.find(user => logic._user.id === user)

      if (pending) {
        link = <button type="button" className="btn btn-primary" onClick={this.handleUnfollowClick}>Unfollow</button>
      } else if (this.props.user.followers) {
        const followed = this.props.user.followers.find(user => logic._user.id === user.id)
        
        if (followed) {
          link = <div>
              <button type="button" className="btn btn-primary" onClick={this.handleUnfollowClick}>Unfollow</button>
              <br />
              <button type="button" className="btn btn-success mt-2" onClick={this.handleChatClick}>Chat</button>
            </div>
        }
      } else {
        link = <button type="button" className="btn btn-primary" onClick={this.handlefollowClick}>Follow</button>
      }
    } else {
      const followed = this.props.user.followers.find(user => logic._user.id === user.id)
        
      if (followed) {
        link = <div>
            <button type="button" className="btn btn-primary" onClick={this.handleUnfollowClick}>Unfollow</button>
            <br />
            <button type="button" className="btn btn-success mt-2" onClick={this.handleChatClick}>Chat</button>
          </div>
      } else {
        link = <button type="button" className="btn btn-primary" onClick={this.handlefollowClick}>Follow</button>
      }
    }

    return link
  }

  handleEditClick = () => {
    this.props.history.push('/edit')
  }

  handlefollowClick = async () => {
    try {
      const res = await logic.follow(this.props.user.username)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  handleUnfollowClick = async () => {
    try {
      const res = await logic.unfollow(this.props.user.username)

      this.props.update()
    } catch (error) {
      console.error(error.message)
    }
  }

  handleChatClick = async () => {
    try {
      const init = await logic.initChat(this.props.user.id)

      this.props.history.push('/chats')
    } catch(error) {
      console.error(error.message)
    }
  }

  render() {
    return (
      <div>
        <h3 className="mb-3 font-weight-bold">Profile</h3>
        <div className="block">
          {this.props.user && <div className="row">
            <div className="col my-2 text-center">
              <img className="avatar" src={logic.url + this.props.user.avatar} alt="avatar" />
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