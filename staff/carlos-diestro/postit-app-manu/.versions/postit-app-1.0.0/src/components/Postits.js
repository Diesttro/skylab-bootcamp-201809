import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Postits extends Component {
    state = { postits: logic.listPostitsByUser(this.props.userId) }

    handleSubmit = text => {
        console.log('App', 'handleSubmit (setState)')

        const { userId } = this.props

        logic.createPostit(text, userId)

        this.setState({ postits: logic.listPostitsByUser(userId) })
    }

    handleDeletePost = id => {
        logic.deletePostit(id)

        this.setState({ postits: logic.listPostitsByUser(this.props.userId) })
    }

    handleUpdatePost = (id, text) => {
        logic.updatePostit(id, text)

        this.setState({ postits: logic.listPostitsByUser(this.props.userId) })
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

export default Postits
