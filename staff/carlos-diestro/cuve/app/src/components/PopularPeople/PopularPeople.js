import React, { Component } from 'react'
import './PopularPeople.css'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class PopularPeople extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const popular = await logic.getPopularPeople()
      
      this.setState({ popular })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div>
        <h3 className="mb-3 font-weight-bold">Popular people</h3>
        <div className="block">
          <div className="row">
            {this.state.popular && this.state.popular.length ? this.state.popular.map(user => {
              return (
                <div className="col-6 my-2 text-center">
                  <Link to={`/user/${user.username}`}>
                  <img src={logic.url + user.avatar} alt="avatar" />
                  <span className="d-block">@{user.username}</span>
                  </Link>
                </div>)
            }) : 'Not enough data' }
          </div>
        </div>
      </div>
    )
  }
}

export default PopularPeople