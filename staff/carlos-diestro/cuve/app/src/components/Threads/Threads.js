import React, { Component } from 'react'
import './Threads.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Thread from '../Thread/Thread'
import logic from '../../logic'

class Threads extends Component {
  state = {
    threads: null
  }

  componentDidMount = async () => {
    await this.updateThreads()
  }

  componentDidUpdate = async prevProps => {
    if (this.props.writed !== prevProps.writed) {
      await this.updateThreads()
    }
  }

  handleThreadChange = async () => {
    await this.updateThreads()
  }

  updateThreads = async () => {
    switch(this.props.path) {
      case '/home':
        try {
          const threads = await logic.getFollowingUsersThreads()
    
          this.setState({ threads })
        } catch ({ message }) {
          alert(message)
        } 

        break
      case '/profile':
        try {
          const threads = await logic.getUserThreads()
    
          this.setState({ threads })
        } catch ({ message }) {
          alert(message)
        }

        break
    }
  }

  render() {
    return (
        this.state.threads && this.state.threads.length ? this.state.threads.map(thread => <Thread data={thread} update={this.handleThreadChange} />) : 'Nothing to show :('
    )
  }
}

export default Threads