import React, { Component } from 'react'
import './WriteThread.css'
import { Fade, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class WriteThread extends Component {
  state = {
    text: '',
    char: 20,
    maxChar: 20,
    fadeIn: false
  }

  handleChange = event => {
    if (event.target.value.length > this.state.maxChar) return event.preventDefault()

    const text = event.target.value
    const char = this.state.maxChar - event.target.value.length

    this.setState({ text, char })
  }

  handleSubmit = async event => {
    event.preventDefault()

    const res = await logic.writeThread(this.state.text)

    this.setState({ text: '', char: this.state.maxChar })

    // this.toggle()

    // setTimeout(this.toggle, 2000);

    this.props.write()
  }

  toggle = () => {
    this.setState({ fadeIn: !this.state.fadeIn })
  }

  render() {
    return (
      <div className="block thread my-3">
        <form onSubmit={this.handleSubmit}>
          <textarea className="form-control write-thread mb-1" value={this.state.text} onChange={this.handleChange}></textarea>
          <span className="mr-2 char-count">{this.state.char}</span>
          <button type="submit" className="btn btn-primary mt-1">Send</button>
        </form>
        {/* <Fade in={this.state.fadeIn}>
          <Alert color="success">
            added
          </Alert>
        </Fade> */}
      </div>
    )
  }
}

export default WriteThread