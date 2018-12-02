import React, { Component } from 'react'
import './Threads.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Thread from '../Thread/Thread'
import WriteComment from '../WriteComment/WriteComment'
import Comment from '../Comment/Comment'
import Spinner from '../Spinner/Spinner'
import logic from '../../logic'

class Threads extends Component {
  state = {}

  componentDidMount = async () => {
    await this.loadThreads()
  }

  componentDidUpdate = async prevProps => {
    if (this.props.flag !== prevProps.flag) {
      await this.loadThreads()
    }
  }

  update = async () => {
    await this.loadThreads()
  }

  loadThreads = async () => {
    switch(this.props.match.path.replace(/\/:username|\/:id/, '')) {
      case '/home':
        try {
          const threads = await logic.getFollowingUsersThreads()
    
          this.setState({ threads })
        } catch (error) {
          console.log(error)
        } 

        break
      case '/profile':
        try {
          const threads = await logic.getUserThreads()

          this.setState({ threads })
        } catch (error) {
          console.log(error)
        }

        break
      case '/thread':
        try {
          const thread = await logic.getThread(this.props.match.params.id)
          const threads = [thread]
          
          this.setState({ threads, comments: true })
        } catch (error) {
          console.error(error.message)
        }

        break
      case '/user':
        try {
          const user = await logic.getUserDataByUsername(this.props.match.params.username)
          
          if (!user.threads) user.threads = []
          
          this.setState({ threads: user.threads })
        } catch (error) {
          console.log(error)
        }

        break
    }
  }

  loadThreadsComponent = () => {
    let component

    if (this.state.threads) {
      if (this.state.threads.length) {
        component = this.state.threads.map(thread => <Thread data={thread} update={this.update} />)
      } else {
        if (this.props.user && this.props.user.private) {
          if (logic.isLoggedIn && this.props.user.id === logic._user.id) {
            component = 'Does not have threads yet'
          } else {
            component = 'Account is privated'
          }
        } else {
          component = 'Does not have threads yet'
        }
      }
    } else {
      component = <Spinner />
    }

    return component
  }

  render() {
    return (
      <div>
        {this.loadThreadsComponent()}
        {this.state.comments && <WriteComment {...this.props} update={this.update} />}
        {this.state.comments && this.state.threads[0].comments.map(comment => <Comment data={comment} update={this.update} />)}
      </div>
    )
  }
}

export default Threads