// Model (domain)

const storage = sessionStorage
// const storage = localStorage

if (!storage.getItem('postits'))
    storage.setItem('postits', JSON.stringify([]))

// function Postit(text) {
//     this.text = text
//     this.id = Date.now()
// }

class Postit {
    constructor(text) {
        this.text = text
        this.id = Date.now()
    }
}

// Business (logic)?

const logic = {
    createPostit(text) {
        const postit = new Postit(text)

        const postits = JSON.parse(storage.getItem('postits'))

        postits.push(postit)

        storage.setItem('postits', JSON.stringify(postits))
    },

    listPostits() {
        return JSON.parse(storage.getItem('postits'))
    },

    deletePostit(id) {
        let postits = JSON.parse(storage.getItem('postits'))

        postits = postits.filter(postit => postit.id !== id)

        storage.setItem('postits', JSON.stringify(postits))
    }
}

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
        <p>{props.text}</p>

        <button onClick={() => props.onDeletePost(props.id)}><i className="far fa-trash-alt"></i></button>
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

    render() {
        console.log('App', 'render')

        return <div>
            <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

            <InputForm onSubmit={this.handleSubmit} />

            <section>
                {/* {this.state.posts.map((post, index) => <article key={index} className="post">{post}</article>)} */}
                {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} />)}
            </section>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))