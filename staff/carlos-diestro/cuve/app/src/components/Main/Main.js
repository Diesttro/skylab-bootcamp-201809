import React, { Component } from 'react'
import './Main.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import WriteThread from '../WriteThread/WriteThread'
import Threads from '../Threads/Threads'
import Edit from '../Edit/Edit'
import logic from '../../logic'

class Main extends Component {
  state = {
    writed: 0
  }

  componentWillMount = () => {
    // debugger
  }

  handleWritedThread = () => {
    const writed = this.state.writed + 1

    this.setState({ writed })
  }

  loadComponents = () => {
    let components

    switch(this.props.path) {
      case '/home':
      case '/profile':
        components = <div className="col-7 offset-1">
          <h3 class="mb-3 font-weight-bold">Write thread</h3>
          <WriteThread write={this.handleWritedThread} />
          <h3 class="mt-5 mb-3 font-weight-bold">Threads</h3>
          <Threads path={this.props.path} writed={this.state.writed} />
        </div>
        break
      case '/thread':
        components = <div className="col-7 offset-1">
          <h3 class="mb-3 font-weight-bold">Thread</h3>
          <Threads path={this.props.path} thread={this.props.thread} writed={this.state.writed} />
        </div>
        break
      case '/user':
        components = <div className="col-7 offset-1">
          <h3 class="mb-3 font-weight-bold">Threads</h3>
          <Threads path={this.props.path} user={this.props.user} followed={this.props.followed} />
        </div>
        break
      case '/profile/edit':
        components = <div className="col-7 offset-1">
          <h3 class="mb-3 font-weight-bold">Edit</h3>
          <Edit path={this.props.path} user={this.props.user} followed={this.props.followed} />
        </div>
        break
    }

    return components
  }

  render() {
    return this.loadComponents()
  }
}

export default Main