import React, { Component } from 'react'

class Postit extends Component {
    state = { text: this.props.text }


    handleChangeText = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleBlurText = () => {
        this.props.onModifyPostit(this.props.id, this.state.text)
    }

    handleChangeStatus = event => {
        const status = event.target.value

        this.props.onMovePostit(this.props.id, status)
    }

    render() {
        return <article className="post">
            <textarea defaultValue={this.state.text} onChange={this.handleChangeText} onBlur={this.handleBlurText} />

            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>

            <select onChange={this.handleChangeStatus} defaultValue={this.props.status}><option value="TODO">TODO</option><option value="DOING">DOING</option><option value="REVIEW">REVIEW</option><option value="DONE">DONE</option></select>
        </article>
    }
}

export default Postit