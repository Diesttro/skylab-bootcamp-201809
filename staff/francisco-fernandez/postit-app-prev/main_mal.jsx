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
                <article className="article"><p>{props.text}</p></article>
                <button onClick={()=>props.onDeletePost(index)}>X</button>
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

    handleDeletePost = index => {
        const texts = this.state.texts.filter((text, _index)=> index !== _index)

        this.setState({texts})
    }

    render() {
        return <div>
            <h1>Post-It App</h1>

            <InputForm onSubmit={this.addPostit} />
            
            <div className="posts-container">
                {this.state.texts.map((post, index) => 
                    <PostIt key={index} text={post} index={index} onDeletePost={this.handleDeletePost}/>
                )}
            </div>
        </div>
       }
    }



ReactDOM.render(<App />, document.getElementById('root'))