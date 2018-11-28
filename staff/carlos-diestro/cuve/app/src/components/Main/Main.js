import React, { Component } from 'react'
import './Main.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import WriteThread from '../WriteThread/WriteThread'
import Threads from '../Threads/Threads'
import logic from '../../logic'

class Main extends Component {
  state = {
    writed: 0
  }

  handleWritedThread = () => {
    const writed = this.state.writed + 1

    this.setState({ writed })
  }

  render() {
    return (
      <div className="col-7 offset-1">
        <h3 class="mb-3 font-weight-bold">Write thread</h3>
        <WriteThread write={this.handleWritedThread} />
        <h3 class="mt-5 mb-3 font-weight-bold">Threads</h3>
        <Threads path={this.props.path} writed={this.state.writed} />
      </div>
    )
  }
}

export default Main