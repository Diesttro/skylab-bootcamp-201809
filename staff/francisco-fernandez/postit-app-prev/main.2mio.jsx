class InputForm extends React.Component{
    state = {text: ''}

    setText = event => {
        const text = event.target.value
        this.setState({ text })
    }

    addPostit = event => {
        event.preventDefault()  

        this.props.onSubmit(this.state.text)

        this.setState({ text: '' })
                       
    }

    render() {
        return <form onSubmit={this.addPostit}>
                <textarea value={this.state.text} placeholder="Write text here..." onChange={this.setText}></textarea>
                <button type="submit">Create</button>
               </form>

    }
}

function PostIt(props) {
    return <section className="postit">
                <article className="article">{props.text}</article>
                <button>X</button>
            </section>        
} 

class App extends React.Component {

    state = { texts: [] }

    addPostit = text => {
        event.preventDefault()     
        // this.setState(prevState => ({
        //     texts: [...prevState.texts, this.state.text]
        //   }))

          const texts = this.state.texts.concat(text)
          this.setState({ texts })
        } 

    render() {
        return <div>
            <h1>Post-It App</h1>

            <InputForm onSubmit={this.addPostit} />
            
            <div className="posts-container">
                {this.state.texts.map((post, index) => 
                    <PostIt key={index} text={post} />
                )}
            </div>
        </div>
       }
    }



ReactDOM.render(<App />, document.getElementById('root'))