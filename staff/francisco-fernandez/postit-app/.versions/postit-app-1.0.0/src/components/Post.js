import React, { Component } from 'react'

function Post(props) {
    console.log('Post', '"render"')

    return <article className="post">
        <textarea type="input" disabled id={props.id}>{props.text}</textarea>
        <button onClick={() => props.onDeletePost(props.id)}><i className="far fa-trash-alt"></i></button>
        <button onClick={() => props.onEditPost(props.id)}><i className="far fa-edit"></i></button>
    </article>
}

export default Post