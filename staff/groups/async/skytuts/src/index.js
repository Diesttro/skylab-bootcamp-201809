import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Particles from './components/particles';

ReactDOM.render(<App />, document.getElementById('root'));

let canvas = document.getElementById('canvas');

if (canvas) ReactDOM.render(<Particles />, canvas);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
