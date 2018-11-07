class App extends React.Component {
    state = { text: '', posts: [] }

    handleInput = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmit = event => {
        event.preventDefault()

        const posts = this.state.posts.concat(this.state.text)

        this.setState({ posts })
    }

    render() {
        return <div>
            <h1>Post-It App</h1>
            <form onSubmit={this.handleSubmit}>
                <textarea placeholder="Write text here..." onChange={this.handleInput} />
                <button type="submit">Create</button>
            </form>
            <section>
                {this.state.posts.map((post, index) => <article key={index} className="post">{post}</article>)}
                {/* {this.state.posts.map(post => React.createElement(
                    "article",
                    { className: "post" },
                    post
                ))} */}
            </section>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))