import React, { Component } from 'react'
import './ChatList.css'
import { Link } from 'react-router-dom'
import Spinner from '../Spinner/Spinner'
import logic from '../../logic'

class ChatList extends Component {
  state = {
    flag: false
  }

  componentDidMount = async () => {
    try {
      const chats = await logic.getUserChats()
      
      this.setState({ chats })
    } catch (error) {
      console.error(error)
    }
  }

  handleNewChatClick = event => {

  }

  handleChatClick = async (event, id) => {
    event.preventDefault()

    this.props.update(id)
  }

  render() {
    return (
      <div>
        <h3 className="mb-3 font-weight-bold">Chats</h3>
        { this.state.chats ? <div className="block">
          {/* <div className="col text-center">
            <button type="button" className="btn btn-primary" onClick={this.handleNewChatClick}>New chat</button>
          </div> */}
          { this.state.chats.length > 0 ? this.state.chats.map(chat => {
            return (
              <div className="col my-2">  
                { chat.members.map(user => {
                  if (user.id !== logic._user.id) {
                    return <Link to="" onClick={event => this.handleChatClick(event, chat.id)}><img src={logic.url + user.avatar} className="mr-2" />@{user.username}</Link>
                  }
                })}
              </div>
            )
          }) : 'You do not have chats' }
          <div className="w-100"></div>
        </div> : <Spinner /> }
      </div>
    )
  }
}

export default ChatList