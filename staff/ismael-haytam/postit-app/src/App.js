import React, { Component } from 'react';
// import PostIt from './components/postit/'
import Register from './components/auth/register'

import './App.css';

class App extends Component {
  render() {
    return <Register />
  }
  // render() {
  //   return <div className="lists">
  //     <PostIt title="TODO" />
  //     <PostIt title="DOING" />
  //     <PostIt title="REVIEW" />
  //     <PostIt title="DONE" />
  //   </div>
  // }
}

export default App;
