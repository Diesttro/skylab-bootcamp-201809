import React from 'react';

function Button(props) {
    return <button className="btn" onClick={() => props.click()}>+</button>
}

export default Button;