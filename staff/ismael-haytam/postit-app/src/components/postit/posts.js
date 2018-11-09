import React from 'react';

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

export default Posts;