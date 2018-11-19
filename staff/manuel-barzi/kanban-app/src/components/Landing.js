import React from 'react'

function Landing(props) {
    return <section>
        <button onClick={props.onRegisterClick}>Register</button> or <button onClick={props.onLoginClick}>Login</button>
    </section>
}

export default Landing