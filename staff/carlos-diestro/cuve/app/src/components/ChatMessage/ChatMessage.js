import React, { Component } from 'react'
import './ChatMessage.css'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import io from 'socket.io-client'

class ChatMessage extends Component {
  state = {}

  componentDidUpdate = async prevProps => {
    if (this.props.chat !== prevProps.chat) {
      const chat = await logic.getChat(this.props.chat)

      this.setState({ chat, text: '' })
    }

    if (this.state.chat && this.state.chat.messages) {
      this.scroll()
    }
  }

  handleChange = event => {
    this.setState({ text: event.target.value })
  }

  handleChatSubmit = async event => {
    event.preventDefault()

    const to = this.state.chat.members.find(user => logic._user.id !== user.id)

    if (to) {
      try {
        const added = await logic.sendMessage(to.id, this.state.text)
        
        const chat = await logic.getChat(this.state.chat.id)

        this.setState({ chat, text: '' })
      } catch (error) {
        console.log(error)
      }
    }
  }

  scroll = () => {
    debugger
    this.chat.scrollTop = this.chat.scrollHeight - this.chat.clientHeight
  }

  render() {
    // const socket = io(logic.url)
    
    // socket.on('refresh', function(data) {
    //   console.log(data)
    // })

    return (
      <div className="block chat my-3">
        { this.state.chat ? <div>
          <div className="messages" ref={(ref) => this.chat = ref}>
            { this.state.chat.messages.map(message => {
              return (
                <div className={message.sender.id === logic._user.id ? 'col-8 offset-4 my-msg my-1 py-1 text-right' : 'col-8 msg my-1 py-1 text-left'}>
                  { message.text }
                </div>
              )
            }) }
          </div>
          <div className="col-12 mt-3">
            <form onSubmit={this.handleChatSubmit}>
              <input type="text" name="message" className="form-control" value={this.state.text} placeholder="Write here..." autocomplete="off" onChange={this.handleChange} />
            </form>
          </div>
        </div> : 'No chat selected' }
      </div>
    )
  }
}

export default ChatMessage