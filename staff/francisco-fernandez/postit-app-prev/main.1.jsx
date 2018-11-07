function Button(props) {
    return <button type="button" onClick={props.onClick}>{props.operation}</button>
}

function PostIt(props) {
    return <section className="postit">
                <article className="article">{props.text}</article>
                <button>X</button>
            </section>        
} 

class App extends React.Component {

    state = { text: "Write text here...", texts: []}

    setText = event => {
        const text = event.target.value
        this.setState({ text })
    }

    addPostit = (event) => {
        event.preventDefault()     
        this.setState(prevState => ({
            texts: [...prevState.texts, this.state.text]
          })) 
        // const result = this.state.text
        // this.setState({ result })
        
    }

    render() {
        return <div>
            <h1>Post-It App</h1>
            <form>
                <textarea placeholder="Write text here..." onChange={this.setText}></textarea>
                <Button operation="Add Postit" onClick={this.addPostit}></Button>
            </form>
            {/* <section>
                <article>{this.state.result}</article>
            </section> */}
            <div className="posts-container">
                {this.state.texts.map((post, index) => {
                    return <PostIt key={index} text={post} />
                })}
            </div>
        </div>
       
    }
}

ReactDOM.render(<App />, document.getElementById('root'))