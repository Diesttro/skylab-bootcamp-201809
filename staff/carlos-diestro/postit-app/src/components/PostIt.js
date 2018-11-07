import React, { Component } from 'react'
import logic from '../logic'
import Form from './Form'
import PostItList from './PostItList'

class PostIt extends Component {
  state = {
    user: this.props.user,
  }

  render() {
    return (
      <div className="row justify-content-center my-3">
        <div className="col-6">
          <div className="text-center mt-3 mb-4">
            <h2 className="font-weight-normal mt-3 mb-2">Post-<span className="badge badge-warning">it</span></h2>
            <h5 className="text-center">de {this.state.user.name}</h5>
          </div>
          <Form onSubmit={this.handleSubmit} />
          <a href="#" onClick={this.handleClick}>Log Out</a>
          <PostItList items={this.state.user.postits} onRemoveItem={this.handleRemoveItem} />
        </div>
      </div>
    )
  }

  handleClick = event => {
    this.props.onClick()
  }

  handleSubmit = text => {
    logic.createPostIt(this.state.user.id, text)

    this.setState({ items: logic.listPostIts(this.state.user.id) })
  }

  handleRemoveItem = (id) => {
    logic.deletePostIt(id)

    this.setState({ items: logic.listPostIts(this.state.user.id) })
  }
}

export default PostIt