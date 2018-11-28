import React, { Component } from 'react'
import './Trend.css'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import logic from '../../logic'

class Trend extends Component {
  state = { }

  render() {
    return (
      <div>
        <h3 class="mb-3 font-weight-bold">Trends</h3>
        <div class="block">
          <div class="row">
            <div class="col my-2"><a href="#">#react</a></div>
            <div class="col my-2"><a href="#">#gulp</a></div>
            <div class="col my-2"><a href="#">#mocha</a></div>
            <div class="col my-2"><a href="#">#python</a></div>
            <div class="col my-2"><a href="#">#nodejs</a></div>
            <div class="col my-2"><a href="#">#webpack</a></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Trend