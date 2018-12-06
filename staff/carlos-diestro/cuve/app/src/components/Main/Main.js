import React, { Component } from 'react'
import './Main.css'
import WriteThread from '../WriteThread/WriteThread'
import Threads from '../Threads/Threads'
import Followers from '../Followers/Followers'
import Following from '../Following/Following'
import Edit from '../Edit/Edit'
import SearchList from '../SearchList/SearchList'
import NotificationList from '../NotificationList/NotificationList'
import ChatMessage from '../ChatMessage/ChatMessage'
import Spinner from '../Spinner/Spinner'
import logic from '../../logic';


class Main extends Component {
  state = {
    flag: false,
    tab: 'threads'
  }

  loadComponent = () => {
    switch(this.props.match.path.replace(/\/:username|\/:id/, '')) {
      case '/home':
      case '/profile':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Write thread</h3>
            <WriteThread update={this.update} />
            <h3 className="mt-5 mb-3 font-weight-bold">Threads</h3>
            <Threads {...this.props} flag={this.state.flag} />
          </div>
        )
      case '/thread':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Thread</h3>
            <Threads {...this.props} />
          </div>
        )
      case '/user':
        let component

        if (this.props.user) {
          if (logic.isLoggedIn && this.props.user.id === logic._user.id) this.props.history.push('/profile')

          if (this.props.user.private && !this.props.user.threads) {
            component = <div className="col-lg-7 offset-lg-1 mt-5 mb-2 text-center">
              <h3 className="mb-3 font-weight-bold">User is private</h3>
            </div>
          } else {
            component = <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
              <div className="row text-center">
                <div className="col">
                  <button type="button" className={this.state.tab === 'threads' ? 'btn btn-primary' : 'btn btn-link'} onClick={() => this.handleTabClick('threads')}>Threads</button>
                </div>
                <div className="col">
                  <button type="button" className={this.state.tab === 'followers' ? 'btn btn-primary' : 'btn btn-link'} onClick={() => this.handleTabClick('followers')}>Followers</button>
                </div>
                <div className="col">
                  <button type="button" className={this.state.tab === 'following' ? 'btn btn-primary' : 'btn btn-link'} onClick={() => this.handleTabClick('following')}>Following</button>
                </div>
              </div>
              {this.loadTab(this.state.tab)}
            </div>
          }
        } else {
          component = <Spinner />
        }

        return component
      case '/edit':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Edit</h3>
            <Edit {...this.props} />
          </div>
        )
      case '/search':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Results</h3>
            <SearchList {...this.props} />
          </div>
        )
      case '/notifications':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Notifications</h3>
            <NotificationList {...this.props} />
          </div>
        )
      case '/chats':
        return (
          <div className="col-lg-7 offset-lg-1 mt-5 mb-2">
            <h3 className="mb-3 font-weight-bold">Messages</h3>
            <ChatMessage {...this.props} />
          </div>
        )
    }
  }

  handleTabClick = tab => {
    this.setState({ tab })
  }

  loadTab = tab => {
    switch (tab) {
      case 'threads':
        return <Threads {...this.props} user={this.props.user} followed={this.props.followed} />
      case 'followers':
        return <Followers {...this.props} user={this.props.user} />
      case 'following':
        return <Following {...this.props} user={this.props.user} />
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