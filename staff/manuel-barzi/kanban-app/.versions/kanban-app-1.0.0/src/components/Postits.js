import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Postit from './Postit'

class Postits extends Component {
    state = { postits: [] }

    componentDidMount() {
        logic.listPostits()
            .then(postits => { this.setState({ postits }) })

        // TODO error handling!
    }

    handleSubmit = text => {
        try {
            logic.addPostit(text)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))
        } catch ({ message }) {
            alert(message) // HORROR! FORBIDDEN! ACHTUNG!
        }
    }

    // TODO error handling!

    handleRemovePostit = id =>
        logic.removePostit(id)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!


    handleModifyPostit = (id, text) =>
        logic.modifyPostit(id, text)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!

    handleMovePostit = (id, status) =>
        logic.movePostit(id, status)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    render() {
        return <div>
            <h1 className="text-center">Kanban App <i className="fas fa-sticky-note"></i></h1>

            <InputForm onSubmit={this.handleSubmit} />
            <div className="container-fluid">
                <div className="row">
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>TODO</h2>
                        {this.state.postits.filter(postit => postit.status === 'TODO').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>DOING</h2>
                        {this.state.postits.filter(postit => postit.status === 'DOING').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>REVIEW</h2>
                        {this.state.postits.filter(postit => postit.status === 'REVIEW').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>DONE</h2>
                        {this.state.postits.filter(postit => postit.status === 'DONE').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} />)}
                    </section>
                </div>
            </div>
        </div>
    }
}

export default Postits
