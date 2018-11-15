import React, { Component } from 'react'
import logic from '../logic'

class Post extends Component {
    state = { text: this.props.text, status: this.props.status }

    handleSelectChange = event => {
        const status = event.target.value

        this.setState({ status })

        this.props.onUpdatePost(this.props.id, this.state.text, status)
    }

    handleChange = event => {
        const text = event.target.value
        const status = event.target.dataset.status

        this.setState({ text, status })
    }

    handleCollabChange = event => {
        const name = event.target.value
        debugger
        logic.addCollaborator(this.props.id, name).then(res => {debugger})
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.id, this.state.text, this.state.status)
    }

    render() {
        return <article id={this.props.id} className="post px-2 my-3 py-2" draggable="true" onDragStart={this.props.onDrag}>
            <select className="form-control" value={this.state.status} onChange={this.handleSelectChange}>
                <option value="TODO">TODO</option>
                <option value="DOING">DOING</option>
                <option value="REVIEW">REVIEW</option>
                <option value="DONE">DONE</option>
            </select>
            <textarea className="w-100" defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} data-status={this.props.status} />
            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
            <select className="form-control" onChange={this.handleCollabChange}>
                <option>Collaborators</option>
                {this.props.friends.map(friend => <option value={friend}>{friend}</option>)}
            </select>
        </article>
    }
}

export default Post