import React, { Component } from 'react'
import './User.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class User extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    if (this.props.user !== prevProps.user) {
      this.setState(this.props.user)
    }
  }

  render() {
    return (
      <div>
        <h3 class="mb-3 font-weight-bold">Profile</h3>
        <div class="block">
          <div class="row">
            <div class="col my-2 text-center"><img class="avatar" src="https://via.placeholder.com/80x80.png?text=+" alt="avatar" /></div>
            <div class="w-100"></div>
            <div class="col"><strong>{this.state.fullname}</strong></div>
            <div class="w-100"></div>
            <div class="col">@{this.state.username}</div>
            <div class="w-100"></div>
            <div class="col my-2">{new Date(this.state.signed).toLocaleString()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default User