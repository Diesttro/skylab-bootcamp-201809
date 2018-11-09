function Button(props) {
    return <button className="btn" onClick={() => props.click()}>+</button>
 }
 
function Posts(props)  {

    const posts = props.posts;
    const listPosts = posts.map((post, index) =>
        <div className="card" key={index} draggable="true" onDragStart={(e) => props.drag(e)} id={`${Date.now()}`}>
            <p>{post}</p>
            <div className="center">
                <button onClick={() => props.remove(index)}>✖</button>
                <button onClick={() => props.edit(index, post)}>✎</button>
            </div>
        </div>
    );
    return (
        <article onDragOver={(e)=>props.allowDrop(e)} onDrop={(e)=>props.drop(e)}  className="container">{listPosts}</article>
    );
 }
 
 class PostIt extends React.Component {

    constructor() {
        super();

        this.state = { 
            text: '', 
            posts: [],
            edit: {
                status: false,
                text: '',
                key: null
            }
        }
    }

 
    keepMessage = event => this.setState({ text: event.target.value });
 
    print = onClick => {

        this.setState(prev => ( {
            text: '',
            posts: [...prev.posts, this.state.text] 
        }));
        
    };

    remove = key => {
        this.setState(prevState => ({
            posts: this.state.posts.filter((_, i) => i !== key)
        }))
    };

    edit = (key, post) => {
        this.setState(prev => ( {
            edit: {
                status: !this.state.edit.status,
                text: post,
                key
            }
        }));
    };

    updatePost = event => {
        let inputValue = event.target.value;
        let statusCopy = Object.assign({}, this.state);

        statusCopy.edit.text = inputValue
        statusCopy.posts[this.state.edit.key] = inputValue;

        this.setState(statusCopy);
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
    drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data)); 
    }

    render() {
        return <div className="list">
            <h4>{this.props.title}</h4>
            <div>
                <input className="addInput" placeholder="Write your post it here" value={this.state.text} type="text" onChange={this.keepMessage} tabIndex="0" />
                <Button click={this.print}></Button>
            </div>
            <Posts allowDrop={this.allowDrop} drag={this.drag} drop={this.drop} edit={this.edit} remove={this.remove} posts={this.state.posts} />
            {this.state.edit.status &&
                <div className="edit">
                    <input className="editInput" type="text" value={this.state.edit.text} onChange={this.updatePost}/>
                    <button className="btn" onClick={() => this.edit(null, '')}>✔</button>
                </div>
            }
        </div>
    }
 }

class App extends React.Component {
    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
    drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }
    render() {
        return <div className="lists">
                    <PostIt title="TODO"/>
                    <PostIt title="DOING"/>
                    <PostIt title="REVIEW"/>
                    <PostIt title="DONE"/>
                </div>
    }
}
 
 ReactDOM.render(<App />, document.getElementById('root'))