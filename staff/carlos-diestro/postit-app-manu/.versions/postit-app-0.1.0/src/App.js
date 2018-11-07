import React, { Component } from 'react'
import logic from './logic'
import InputForm from './components/InputForm'
import Post from './components/Post'

class App extends Component {
  state = { postits: logic.listPostits() }

  handleSubmit = text => {
      console.log('App', 'handleSubmit (setState)')

      logic.createPostit(text)

      this.setState({ postits: logic.listPostits() })
  }

  handleDeletePost = id => {
      logic.deletePostit(id)

      this.setState({ postits: logic.listPostits() })
  }

  handleUpdatePost = (id, text) => {
      logic.updatePostit(id, text)

      this.setState({ postits: logic.listPostits() })
  }

  render() {
      console.log('App', 'render')

      return <div>
          <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

          <InputForm onSubmit={this.handleSubmit} />

          <section>
              {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} onUpdatePost={this.handleUpdatePost} />)}
          </section>
      </div>
  }
}

export default App
