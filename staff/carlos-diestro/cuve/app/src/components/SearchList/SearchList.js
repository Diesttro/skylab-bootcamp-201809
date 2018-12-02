import React, { Component } from 'react'
import './SearchList.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class SearchList extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const results = await logic.searchUser(this.props.match.params.username)
      
      this.setState({ results })
    } catch (error) {
      console.error(error)
    }
  }

  componentDidUpdate = async prevProps => {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      try {
        const results = await logic.searchUser(this.props.match.params.username)
        
        this.setState({ results })
      } catch (error) {
        console.error(error)
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.results && <div className="block my-3">
          <div className="row">
            <div className="col text">
              {this.state.results.length ? this.state.results.map(user => (
                <div className="row my-2">
                  <div className="col">
                    <Link to={`/user/${user.username}`}><img src="https://via.placeholder.com/55x55.png?text=+" alt="" /> @{user.username}</Link>
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

export default SearchList