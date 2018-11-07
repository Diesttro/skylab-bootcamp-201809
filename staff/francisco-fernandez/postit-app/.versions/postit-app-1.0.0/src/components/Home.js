import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Home extends React.Component {
debugger
  state = { postits: logic.listPostitsUser() }

  handleSubmit = text => {
      console.log('App', 'handleSubmit (setState)')

      logic.createPostit(text)

      this.setState({ postits: logic.listPostitsUser() })
  }

  handleDeletePost = id => {
      logic.deletePostit(id)

      this.setState({ postits: logic.listPostitsUser() })
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


export default Home
