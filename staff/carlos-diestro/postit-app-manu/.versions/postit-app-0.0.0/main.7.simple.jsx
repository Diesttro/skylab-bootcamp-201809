// Presentation (components)

class InputForm extends React.Component {
    state = { text: '' }

    handleInput = event => {
        console.log('InputForm', 'handleInput (setState)')

        const text = event.target.value

        this.setState({ text })
    }

    handleSubmit = event => {
        console.log('InputForm', 'handleSubmit (setState)')

        event.preventDefault()

        this.props.onSubmit(this.state.text)

        this.setState({ text: '' })
    }

    render() {
        console.log('InputForm', 'render')

        return <form onSubmit={this.handleSubmit}>
            <input value={this.state.text} placeholder="Write text here..." onChange={this.handleInput} />

            <button type="submit"><i className="fas fa-plus"></i></button>
        </form>
    }
}

class Post extends React.Component {
    state = { text: this.props.text }


    handleChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.id, this.state.text)
    }

    render() {
        console.log('Post', '"render"')

        return <article className="post">
            <textarea defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />

            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
        </article>
    }
}

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

    handleUpdatePost = (id, text) => {
        logic.updatePostit(id, text)

        this.setState({ postits: logic.listPostits() })
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

ReactDOM.render(<App />, document.getElementById('root'))