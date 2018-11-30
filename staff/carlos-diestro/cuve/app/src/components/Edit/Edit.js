import React, { Component } from 'react'
import './Edit.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Thread from '../Thread/Thread'
import WriteComment from '../WriteComment/WriteComment'
import Comment from '../Comment/Comment'
import logic from '../../logic'

class Edit extends Component {
  state = {}

  componentWillMount = async () => {
  
  }

  render() {
    return (
      <div className="block thread my-3">Edit here</div>
    )
  }
}

export default Edit