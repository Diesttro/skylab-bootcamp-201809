import React, { Component } from 'react'
import './NotificationList.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class NotificationList extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  handleAcceptClick = async (event, username) => {
    try {
      debugger
      const result = await logic.acceptFollow(username)

      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  handleRejectClick = async (event, username) => {
    debugger
    try {
      const result = await logic.rejectFollow(username)

      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div>
        {this.state.user && <div className="block my-3">
          <div className="row">
            <div className="col text">
              {this.state.user.pending.length ? this.state.user.pending.map(user => (
                <div className="row align-items-center my-2">
                  <div className="col">
                    <Link to={`/user/${user.username}`}><img src={user.avatar} alt="" /> @{user.username}</Link>
                  </div>
                  <div className="col text-right">
                    <button type="button" className="btn btn-primary mr-2" onClick={event => this.handleAcceptClick(event, user.username)}>Accept</button>
                    <button type="button" className="btn btn-dark" onClick={event => this.handleRejectClick(event, user.username)}>Reject</button>
                  </div>
                </div>
              )) : 'Nothing found'}
            </div>
          </div>
        </div>}
      </div>
    )
  }
}

export default NotificationList