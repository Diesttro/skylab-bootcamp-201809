import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Postits extends Component {
    state = { postits: [] }

    componentDidMount() {
        logic.listPostits()
            .then(postits => { this.setState({ postits }) })

        // TODO error handling!
    }

    handleSubmit = text =>
        logic.createPostit(text)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!

    handleDeletePost = id =>
        logic.deletePostit(id)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!


    handleUpdatePost = (id, text) =>
        logic.updatePostit(id, text)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!


    render() {
        return <div>
            <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

            <InputForm onSubmit={this.handleSubmit} />

            <section>
                {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} onUpdatePost={this.handleUpdatePost} />)}
            </section>
        </div>
    }
}

export default Postits
