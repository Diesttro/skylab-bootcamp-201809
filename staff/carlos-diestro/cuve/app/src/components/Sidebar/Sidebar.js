import React, { Component } from 'react'
import './Sidebar.css'
import Trend from '../Trend/Trend'
import PopularPeople from '../PopularPeople/PopularPeople'
import User from '../User/User'

class Sidebar extends Component {
  state = {}

  loadComponent = () => {
    switch(this.props.match.path.replace(/\/:username|\/:id/, '')) {
      case '/home':
      case '/thread':
      case '/search':
        return (
          <div className="col-4">
            <Trend />
            <div className="w-100 my-5"></div>
            <PopularPeople />
          </div>
        )
      case '/profile':
      case '/edit':
        return (
          <div className="col-4">
            <User {...this.props} />
          </div>
        )
      case '/user':
        return (
          <div className="col-4">
            <User {...this.props} update={this.update} />
          </div>
        )
      case '/notifications':
        return (
          <div className="col-4">
            <PopularPeople />
          </div>
        )
    }
  }

  update = () => {
    this.props.update()
  }

  render() {
    return this.loadComponent()
  }
}

export default Sidebar