import React, { Component } from 'react'
import './Comment.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Comment extends Component {
  state = {}

  render() {
    debugger
    return (
      <div className="block thread ml-2 my-3">
        <div className="row">
          <div className="col-2">
            <a href="#"><img src={logic.url + this.props.data.author.avatar} alt="" /></a>
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
          </div>
        </div>
      </div>
    )
  }
}

export default Comment