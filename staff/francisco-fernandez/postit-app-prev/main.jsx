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

function Post(props) {
    console.log('Post', '"render"')

    return <article className="post">
        <textarea type="input" disabled id={props.id}>{props.text}</textarea>
        <button onClick={() => props.onDeletePost(props.id)}><i className="far fa-trash-alt"></i></button>
        <button onClick={() => props.onEditPost(props.id)}><i className="far fa-edit"></i></button>
    </article>
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

ReactDOM.render(<App />, document.getElementById('root'))