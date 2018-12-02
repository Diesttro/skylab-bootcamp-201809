import React, { Component } from 'react'
import './Thread.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Thread extends Component {
  state = {}

  shareLink = id => {
    const shared = this.props.data.shares.find(share => logic._user.id === share)
    let link

    if (shared) link = <button type="button" className="btn btn-link clicked" onClick={() => this.handleUnshareClick(id)}>SHARE</button>
    else link = <button type="button" className="btn btn-link" onClick={() => this.handleShareClick(id)}>SHARE</button>

    return link
  }

  handleShareClick = async id => {
    try {
      const res = await logic.shareThread(id)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  handleUnshareClick = async id => {
    try {
      const res = await logic.unshareThread(id)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  likeLink = id => {
    const liked = this.props.data.likes.find(like => logic._user.id === like)
    let link
    
    if (liked) link = <button type="button" className="btn btn-link clicked" onClick={() => this.handleUnlikeClick(id)}>LIKE</button>
    else link = <button type="button" className="btn btn-link" onClick={() => this.handleLikeClick(id)}>LIKE</button>

    return link
  }

  handleLikeClick = async id => {
    try {
      const res = await logic.likeThread(id)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  handleUnlikeClick = async id => {
    try {
      const res = await logic.unlikeThread(id)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  deleteLink = id => {
    if (logic._user.id === this.props.data.author.id) return <div className="col-3 statistics">
      <button type="button" className="btn btn-link" onClick={() => this.handleDeleteClick(id)}>DELETE</button>
    </div>
  }

  handleDeleteClick = async id => {
    try {
      const res = await logic.deleteThread(id)

      this.props.update()
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return (
      <div className="block thread my-3">
        <div className="row">
          <div className="col-2">
            <a href="#"><img src="https://via.placeholder.com/55x55.png?text=+" alt="" /></a>
          </div>
          <div className="col text">
            <Link to={`/user/${this.props.data.author.username}`} className="username">@{this.props.data.author.username}</Link>
            <div className="row">
              <div className="col mb-3">
                <time className="date">{new Date(this.props.data.date).toLocaleString()}</time>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <p>{this.props.data.text}</p>
              </div>
            </div>
            {logic._user && <div className="row" data-id={this.props.data.id}>
              <div className="col-3 statistics">
              <Link to={`/thread/${this.props.data.id}`}><button type="button" className="btn btn-link">REPLY</button></Link>
                <span className="count ml-2">{this.props.data.comments.length}</span>
              </div>
              <div className="col-3 statistics">
                {this.shareLink(this.props.data.id)}
                <span className="count ml-2">{this.props.data.shares.length}</span>
              </div>
              <div className="col-3 statistics">
                {this.likeLink(this.props.data.id)}
                <span className="count ml-2">{this.props.data.likes.length}</span>
              </div>
              {this.deleteLink(this.props.data.id)}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Thread