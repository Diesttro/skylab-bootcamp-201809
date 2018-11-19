import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Postit from './Postit'
import CollaboratorModal from './CollaboratorModal'

class Postits extends Component {
    state = { postits: [], postitId: null }

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

    handleAssignCollaborator = id => this.setState({ postitId: id })

    handleMovePostit = (id, status) =>
        logic.movePostit(id, status)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    handleCollaboratorSelection = (postitId, collaboratorId) => {
        logic.assignPostit(postitId, collaboratorId)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits, postitId: null }))
    }

    render() {
        return <div>
            <h1 className="text-center">Kanban App <i className="fas fa-sticky-note"></i></h1>

            <InputForm onSubmit={this.handleSubmit} />
            <div className="container-fluid">
                <div className="row">
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>TODO</h2>
                        {this.state.postits.filter(postit => postit.status === 'TODO').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} onAssignCollaborator={this.handleAssignCollaborator} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>DOING</h2>
                        {this.state.postits.filter(postit => postit.status === 'DOING').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} onAssignCollaborator={this.handleAssignCollaborator} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>REVIEW</h2>
                        {this.state.postits.filter(postit => postit.status === 'REVIEW').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} onAssignCollaborator={this.handleAssignCollaborator} />)}
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3">
                        <h2>DONE</h2>
                        {this.state.postits.filter(postit => postit.status === 'DONE').map(postit => <Postit key={postit.id} text={postit.text} status={postit.status} id={postit.id} onDeletePost={this.handleRemovePostit} onModifyPostit={this.handleModifyPostit} onMovePostit={this.handleMovePostit} onAssignCollaborator={this.handleAssignCollaborator} />)}
                    </section>
                </div>
            </div>

            <CollaboratorModal postitId={this.state.postitId} collaborators={[{ name: 'Pepito', id: '123' }, { name: 'Grillo', id: '124' }]} onCollaboratorSelection={this.handleCollaboratorSelection} />
        </div>
    }
}

export default Postits
