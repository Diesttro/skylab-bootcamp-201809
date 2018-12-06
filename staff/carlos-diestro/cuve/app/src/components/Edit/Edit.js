import React, { Component } from 'react'
import './Edit.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Thread from '../Thread/Thread'
import WriteComment from '../WriteComment/WriteComment'
import Comment from '../Comment/Comment'
import logic from '../../logic'

class Edit extends Component {
  state = {}

  componentDidMount = () => {
    if (this.props.user) {
      this.setState(this.props.user)
    }
  }

  componentDidUpdate = prevProps => {
    if (!!this.props.user === !prevProps.user) {
      this.setState(this.props.user)
    }
  }

  handleChange = event => {
    const input = event.target

    switch (input.name) {
      case 'avatar':
        this.setState({ avatar: input.files[0] })
        break
      case 'fullname':
        this.setState({ fullname: input.value })
        break
      case 'username':
        this.setState({ username: input.value })
        break
      case 'email':
        this.setState({ email: input.value })
        break
      case 'description':
        this.setState({ description: input.value })
        break
      case 'private':
        this.setState({ private: input.checked })
        break
    }
  }

  handleSubmit = async event => {
    event.preventDefault()
    
    try {
      const result = await logic.saveChanges(
        this.state.avatar,
        this.state.fullname,
        this.state.username,
        this.state.email,
        this.state.description,
        this.state.private
      )

      this.setState({ message: 'changes saved', ok: true })
    } catch ({ message }) {
      this.setState({ message, ok: false })
    }
  }

  render() {
    return (
      <div>
        { this.state.message && <div className={this.state.ok ? 'alert alert-success text-center' : 'alert alert-danger text-center'} role="alert">
        { this.state.message }
        </div> }
        {this.state.avatar && <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
        <div className="block edit my-3">
          <div className="col">
            <div className="form-group">
              <label for="file">Avatar</label>
              <div class="custom-file">
                <input type="file" name="avatar" class="custom-file-input" id="file" onChange={this.handleChange} />
                <label class="custom-file-label" for="file">{typeof this.state.avatar === 'string' ? 'Choose file' : this.state.avatar.name}</label>
              </div>
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col">
            <div className="form-group">
              <label for="fullname">Fullname</label>
              <input type="text" name="fullname" className="form-control" id="fullname" value={this.state.fullname} onChange={this.handleChange} />
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col">
            <div className="form-group">
              <label for="fullname">Username</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">@</div>
                </div>
                <input type="text" name="username" className="form-control" id="username" value={this.state.username} onChange={this.handleChange} />
              </div>
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col">
            <div className="form-group">
              <label for="email">Email</label>
              <input type="text" name="email" className="form-control" id="email" value={this.state.email} onChange={this.handleChange} />
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col">
            <div className="form-group">
              <label for="description">Description</label>
              <input type="text" name="description" className="form-control" id="description" value={this.state.description} onChange={this.handleChange} />
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col">
            Profile visibility
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="private" id="private" checked={this.state.private} onChange={this.handleChange} />
              <label className="form-check-label" for="private">
                Private
              </label>
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col text-right">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </div>
      </form>}
      </div>
    )
  }
}

export default Edit