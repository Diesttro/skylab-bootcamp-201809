import React, { Component } from 'react'
import './Threads.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Thread from '../Thread/Thread'
import WriteComment from '../WriteComment/WriteComment'
import Comment from '../Comment/Comment'
import logic from '../../logic'

class Threads extends Component {
  state = {
    threads: null,
    comments: false,
    private: false
  }

  componentWillMount = async () => {
    await this.updateThreads()
  }

  componentDidUpdate = async prevProps => {
    if (this.props.writed !== prevProps.writed) {
      await this.updateThreads()
    } else if (this.props.followed !== prevProps.followed) {
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
      case '/thread':
        try {
          const thread = await logic.getThread(this.props.thread)
          const threads = [thread]
          
          this.setState({ threads, comments: true })
        } catch ({ message }) {
          alert(message)
        }

        break
      case '/user':
        try {
          const user = await logic.getUserDataByUsername(this.props.user)
          
          this.setState({ threads: user.data.threads })
        } catch ({ message }) {
          alert(message)
        }

        break
    }
  }

  render() {
    return (
        <div>
        {this.state.threads && this.state.threads.length ? this.state.threads.map(thread => <Thread data={thread} update={this.handleThreadChange} />) : 'Nothing to show :('}
        {this.state.comments && <WriteComment thread={this.props.thread} update={this.handleThreadChange} />}
        {this.state.comments && this.state.threads[0].comments.map(comment => <Comment data={comment} update={this.handleThreadChange} />)}
        </div>
    )
  }
}

export default Threads