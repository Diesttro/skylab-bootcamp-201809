import React, { Component } from 'react'
import './Main.css'
import WriteThread from '../WriteThread/WriteThread'
import Threads from '../Threads/Threads'
import Edit from '../Edit/Edit'
import SearchList from '../SearchList/SearchList'
import NotificationList from '../NotificationList/NotificationList'

class Main extends Component {
  state = {
    flag: false
  }

  loadComponent = () => {
    switch(this.props.match.path.replace(/\/:username|\/:id/, '')) {
      case '/home':
      case '/profile':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Write thread</h3>
            <WriteThread update={this.update} />
            <h3 className="mt-5 mb-3 font-weight-bold">Threads</h3>
            <Threads {...this.props} flag={this.state.flag} />
          </div>
        )
      case '/thread':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Thread</h3>
            <Threads {...this.props} />
          </div>
        )
      case '/user':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Threads</h3>
            <Threads {...this.props} user={this.props.user} followed={this.props.followed} />
          </div>
        )
      case '/edit':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Edit</h3>
            <Edit {...this.props} />
          </div>
        )
      case '/search':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Results</h3>
            <SearchList {...this.props} />
          </div>
        )
      case '/notifications':
        return (
          <div className="col-7 offset-1">
            <h3 className="mb-3 font-weight-bold">Notifications</h3>
            <NotificationList {...this.props} />
          </div>
        )
    }
  }

  update = () => {
    this.setState({ flag: !this.state.flag })
  }

  render() {
    return this.loadComponent()
  }
}

export default Main