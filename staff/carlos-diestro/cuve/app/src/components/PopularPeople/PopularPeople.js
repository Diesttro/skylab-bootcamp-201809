import React, { Component } from 'react'
import './PopularPeople.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class PopularPeople extends Component {
  state = {}

  render() {
    return (
      <div>
        <h3 class="mt-5 mb-3 font-weight-bold">Popular people</h3>
        <div class="block">
          <div class="row">
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
            <div class="col my-2"><img src="https://via.placeholder.com/55x55.png?text=+" alt="avatar" /></div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopularPeople