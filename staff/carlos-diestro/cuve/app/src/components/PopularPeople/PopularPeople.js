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
        <h3 class="mb-3 font-weight-bold">Popular people</h3>
        <div class="block">
          <div class="row">
            {this.state.popular && this.state.popular.length ? this.state.popular.map(user => {
              return (
                <div class="col-4 my-2 text-center">
                  <Link to={`/user/${user.username}`}>
                  <img src={logic.url + user.avatar} alt="avatar" />
                  @{user.username}
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