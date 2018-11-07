import React, { Component } from 'react'
import logic from './logic'
import InputForm from './components/InputForm'
import Post from './Post'

class App extends React.Component {
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

  handleEditPost = id => {
      let element = document.getElementById(id)
      if(element.disabled){
          element.disabled = false}
          else
          {
          
          logic.editPostit(id)
          element.disabled = true
          }
      }
  

  render() {
      console.log('App', 'render')

      return <div>
          <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

          <InputForm onSubmit={this.handleSubmit} />

          <section>
              {/* {this.state.posts.map((post, index) => <article key={index} className="post">{post}</article>)} */}
              {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} onEditPost={this.handleEditPost} />)}
          </section>
      </div>
  }
}


export default App;
