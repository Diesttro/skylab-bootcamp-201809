import React, { Component } from 'react'
import './Sidebar.css'
import Trend from '../Trend/Trend'
import PopularPeople from '../PopularPeople/PopularPeople'
import User from '../User/User'
import ChatList from '../ChatList/ChatList'

class Sidebar extends Component {
  state = {}

  loadComponent = () => {
    switch(this.props.match.path.replace(/\/:username|\/:id/, '')) {
      case '/home':
      case '/thread':
      case '/search':
        return (
          <div className="col-lg-4 mt-5 mb-2">
            <Trend />
            <div className="w-100 my-5"></div>
            <PopularPeople />
          </div>
        )
      case '/profile':
      case '/edit':
        return (
          <div className="col-lg-4 mt-5 mb-2">
            <User {...this.props} />
          </div>
        )
      case '/user':
        return (
          <div className="col-lg-4 mt-5 mb-2">
            <User {...this.props} update={this.update} />
          </div>
        )
      case '/notifications':
        return (
          <div className="col-lg-4 mt-5 mb-2">
            <PopularPeople />
          </div>
        )
      case '/chats':
        return (
          <div className="col-lg-4 mt-5 mb-2">
            <ChatList {...this.props} update={this.update} />
          </div>
        )
    }
  }

  update = id => {
    debugger
    this.props.update(id)
  }

  render() {
    return this.loadComponent()
  }
}

export default Sidebar