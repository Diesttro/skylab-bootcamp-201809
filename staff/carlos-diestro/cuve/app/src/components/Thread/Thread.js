import React, { Component } from 'react'
import './Thread.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Thread extends Component {
  state = {}

  componentDidMount = () => {
    //TODO
  }

  // shareLink = () => {
  //   const shared = this.props.data.shares.find(share => logic._user.id === share)
  //   let link

  //   if (shared) link = <button type="button" className="btn btn-link clicked" onClick={this.handleUnshareClick}>SHARE</button>
  //   else link = <button type="button" className="btn btn-link" onClick={this.handleShareClick}>SHARE</button>

  //   return link
  // }

  // handleShareClick = async event => {
  //   const res = await logic.shareThread(event.target.parentNode.parentNode.dataset.id)

  //   this.props.update()
  // }

  // handleUnshareClick = async event => {
  //   const res = await logic.unshareThread(event.target.parentNode.parentNode.dataset.id)

  //   this.props.update()
  // }

  // likeLink = () => {
  //   const liked = this.props.data.likes.find(like => logic._user.id === like)
  //   let link

  //   if (liked) link = <button type="button" className="btn btn-link clicked" onClick={this.handleUnlikeClick}>LIKE</button>
  //   else link = <button type="button" className="btn btn-link" onClick={this.handleLikeClick}>LIKE</button>

  //   return link
  // }

  // handleLikeClick = async event => {
  //   const res = await logic.likeThread(event.target.parentNode.parentNode.dataset.id)

  //   this.props.update()
  // }

  // handleUnlikeClick = async event => {
  //   const res = await logic.unlikeThread(event.target.parentNode.parentNode.dataset.id)

  //   this.props.update()
  // }

  shareLink = id => {
    const shared = this.props.data.shares.find(share => logic._user.id === share)
    let link

    if (shared) link = <button type="button" className="btn btn-link clicked" onClick={() => this.handleUnshareClick(id)}>SHARE</button>
    else link = <button type="button" className="btn btn-link" onClick={() => this.handleShareClick(id)}>SHARE</button>

    return link
  }

  handleShareClick = async id => {
    const res = await logic.shareThread(id)

    this.props.update()
  }

  handleUnshareClick = async id => {
    const res = await logic.unshareThread(id)

    this.props.update()
  }

  likeLink = id => {
    const liked = this.props.data.likes.find(like => logic._user.id === like)
    let link
    
    if (liked) link = <button type="button" className="btn btn-link clicked" onClick={() => this.handleUnlikeClick(id)}>LIKE</button>
    else link = <button type="button" className="btn btn-link" onClick={() => this.handleLikeClick(id)}>LIKE</button>

    return link
  }

  handleLikeClick = async id => {
    const res = await logic.likeThread(id)

    this.props.update()
  }

  handleUnlikeClick = async id => {
    const res = await logic.unlikeThread(id)

    this.props.update()
  }

  render() {
    return (
      <div className="block thread my-3">
        <div className="row">
          <div className="col-2">
            <a href="#"><img src="https://via.placeholder.com/55x55.png?text=+" alt="" /></a>
          </div>
          <div className="col text">
            <a href="#" className="username">@{this.props.data.author.username}</a>
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
            <div className="row" data-id={this.props.data._id}>
              <div className="col-3 statistics">
              <button type="button" className="btn btn-link">REPLY</button>
                <span className="count ml-2">{this.props.data.comments.length}</span>
              </div>
              <div className="col-3 statistics">
                {this.shareLink(this.props.data._id)}
                <span className="count ml-2">{this.props.data.shares.length}</span>
              </div>
              <div className="col-3 statistics">
                {this.likeLink(this.props.data._id)}
                <span className="count ml-2">{this.props.data.likes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Thread