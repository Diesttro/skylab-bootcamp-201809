
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import defaultData from './default'
import template from './templates/Card.pug';
import Popup from './Popup'
import logicAuth from '../logic/auth'

class Card extends Component {
    state = {showPopup: false}
    
    
    togglePopup = () => {
        this.setState({showPopup: !this.state.showPopup})
      } 

    render() {

        const { course } = this.props

        let popup = (<Popup text='You need to be logged in to view the courses!' closePopup={this.togglePopup}/>)

        let buttonPopup = (<span onClick={this.togglePopup}> + Course Details </span>)

        
        return template.call(this, { 
            course,       
            defaultData,
            popup,
            buttonPopup,
            auth: logicAuth.isAuthenticated(),
            Link
          });
      
    }
}

export default Card
