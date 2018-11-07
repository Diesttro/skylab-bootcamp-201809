import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Postits extends Component {
    state = { postits: [] }

    componentDidMount() {
        console.log('Postits', 'componentDidMount')

        const { userId, token } = this.props

        logic.listPostitsByUser(userId, token)
            .then(postits => { this.setState({ postits }) })

        // TODO error handling!
    }

    handleSubmit = text => {
        const { userId, token } = this.props

        logic.createPostit(text, userId, token)
            .then(() => logic.listPostitsByUser(userId, token))
            .then(postits => this.setState({ postits }))

        // TODO error handling!
    }

    handleDeletePost = id => {
        const { userId, token } = this.props

        logic.deletePostit(id, userId, token)
            .then(() => logic.listPostitsByUser(userId, token))
            .then(postits => this.setState({ postits }))

        // TODO error handling!
    }

    handleUpdatePost = (id, text) => {
        const { userId, token } = this.props

        logic.updatePostit(id, text, userId, token)
            .then(() => logic.listPostitsByUser(userId, token))
            .then(postits => this.setState({ postits }))

        // TODO error handling!
    }

    render() {
        console.log('Postits', 'render')

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
