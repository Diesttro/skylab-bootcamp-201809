import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Popup extends Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>{this.props.text}</h1>
          <img onClick={this.props.closePopup} className="close-btn" alt='X' src='https://docs.updatefactory.io/images/close-x.png'></img>
          <div className='popuplogin'>
          <NavLink to="/login"><button className='popup-btn'>Login</button></NavLink>
          <NavLink to="/register"><button className='popup-btn'>Register</button></NavLink>
          </div>
          </div>
        </div>
      );
    }
  }

export default Popup