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


    handleModifyPostit = (id, text, status) => {
        logic.modifyPostit(id, text, status)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))
    }

    allowDrop = ev => {
        ev.preventDefault()

        ev.currentTarget.classList.add('dashed')
    }

    dragEnter = ev => {
        ev.preventDefault()
        
        ev.currentTarget.classList.add('dashed')
        // debugger
    }

    dragLeave = ev => {
        ev.preventDefault()
    
        ev.currentTarget.classList.remove('dashed')
        // debugger
    }
    
    drop = (ev, status) => {
        ev.preventDefault()

        const id = ev.dataTransfer.getData("id")
        const text = ev.dataTransfer.getData("text")

        ev.currentTarget.classList.remove('dashed')

        this.handleModifyPostit(id, text, status)
    }

    drag = (ev, id, text, status) => {
        ev.dataTransfer.setData("id", id)
        ev.dataTransfer.setData("text", text)
        ev.dataTransfer.setData("status", status)
    }

    handleUpload = event => {
        logic.addImage(event.target.files[0])
        .then(image => {
            this.setState({ image })
        })
    }

    // handleUpload = event => {
    //     logic.addImage(event.target.files[0]).then(blob => {
    //         return this.read(blob)
    //     }).then(img => {
    //         debugger
    //         this.setState({ img })
    //     })
    // }

    // read = (blob) => {
    //     return new Promise((res, rej) => {
    //         const reader = new FileReader()
        
    //         reader.onload = function() {
    //             debugger
    //             res(reader.result)
    //         }
            
    //         reader.readAsDataURL(blob)
    //     })
    // }

    // TODO error handling!

    render() {
        return <div>
            <div className="container">
            <div className="row justify-content-center">
            <h1>Kanban App <i className="fas fa-sticky-note"></i></h1>
            </div>
            <div className="row justify-content-center">
            <InputForm onSubmit={this.handleSubmit} />
            <form enctype="multipart/form-data" onSubmit={this.handleUpload}>
                <input type="file" name="avatar" onChange={this.handleUpload} />
            </form>
            {this.state.image && <img src={this.state.image} />}
            </div>
            </div>
            <div className="container">
            <div className="row">
            <section className="status mx-3 my-3">
                <h3>TODO</h3>
                <div className="h-100 drop" onDrop={event => this.drop(event, 'TODO')} onDragOver={this.allowDrop} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}>
                {this.state.postits.filter(postit => postit.status === 'TODO').sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime()).map(postit => <Post key={postit.id} text={postit.text} id={postit.id} friends={this.props.friends} status={postit.status} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onDrag={event => this.drag(event, postit.id, postit.text, postit.status)} />)}
                </div>
            </section>
            <section className="status mx-3 my-3">
                <h3>DOING</h3>
                <div className="h-100 drop" onDrop={event => this.drop(event, 'DOING')} onDragOver={this.allowDrop} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}>
                {this.state.postits.filter(postit => postit.status === 'DOING').sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime()).map(postit => <Post key={postit.id} text={postit.text} id={postit.id} friends={this.props.friends} status={postit.status} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onDrag={event => this.drag(event, postit.id, postit.text, postit.status)} />)}
                </div>
            </section>
            <section className="status mx-3 my-3">
                <h3>REVIEW</h3>
                <div className="h-100 drop" onDrop={event => this.drop(event, 'REVIEW')} onDragOver={this.allowDrop} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}>
                {this.state.postits.filter(postit => postit.status === 'REVIEW').sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime()).map(postit => <Post key={postit.id} text={postit.text} id={postit.id} friends={this.props.friends} status={postit.status} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onDrag={event => this.drag(event, postit.id, postit.text, postit.status)} />)}
                </div>
            </section>
            <section className="status mx-3 my-3">
                <h3>DONE</h3>
                <div className="h-100 drop" onDrop={event => this.drop(event, 'DONE')} onDragOver={this.allowDrop} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}>
                {this.state.postits.filter(postit => postit.status === 'DONE').sort((a, b) => new Date(a.modified).getTime() - new Date(b.modified).getTime()).map(postit => <Post key={postit.id} text={postit.text} id={postit.id} friends={this.props.friends} status={postit.status} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onDrag={event => this.drag(event, postit.id, postit.text, postit.status)} />)}
                </div>
            </section>
            </div>
            </div>
        </div>
    }
}

export default Postits
