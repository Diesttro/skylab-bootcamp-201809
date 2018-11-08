import React, { Component } from 'react'
import logic from '../logic'

class Profile extends Component {
  state = {}

  componentDidMount = () => {
    logic.getUserData().then(user => {
      this.setState(user)
    })
  }

  handleChange = event => {
    switch(event.target.name) {
      case 'cpass':
        this.setState({ currentPass: event.target.value })
        break
      case 'npass':
        this.setState({ newPass: event.target.value })
        break
      case 'rnpass':
        this.setState({ repNewPass: event.target.value })
    }
  }

  handleSubmit = event => {
    event.preventDefault()

    if (this.state.repNewPass !== this.state.newPass) this.setState({ message: 'passwords does not match' })
    else {
      try {
        logic.updateUserData(this.state.currentPass, this.state.newPass)
          .then((res) => {this.setState({ message: res.message })})
          .catch(error => this.setState({ message: error.message }))
      } catch(error) {
        this.setState({ message: error.message })
      }
    }
  }

  render() {
    return (
      <div>
        <p>Username: {this.state.username}</p>
        <p>Name: {this.state.name}</p>
        <p>Surname: {this.state.surname}</p>
        <form onSubmit={this.handleSubmit}>
          <label>Current password: </label>
          <input type="password" name="cpass" onChange={this.handleChange} />
          <br /><br />
          <label>New password: </label>
          <input type="password" name="npass" onChange={this.handleChange} />
          <br /><br />
          <label>Repeat password: </label>
          <input type="password" name="rnpass" onChange={this.handleChange} />
          <br /><br />
          <button type="submit">Change password</button>
          <br /><br />
        </form>
        {this.state.message ? this.state.message : ''}
      </div>
    )
  }
}

export default Profile