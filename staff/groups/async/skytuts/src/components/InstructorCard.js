import React, { Component } from 'react'


class InstructorCard extends Component {


    render() {

        return (

            <div className="instructor-card">
                    <div className="instructor-img-container">
                        <img className="instructor-img" src={this.props.instructor.image || 'https://api.adorable.io/avatars/285/skytuts.png'} alt="instructor-img"></img>
                    </div>
                    <div className="instructor-info">
                        <h3 className="name">{this.props.instructor.name}</h3>
                        {this.props.instructor.image &&
                        <p className="bio">{this.props.instructor.bio}</p>}
                    </div>
            </div>

        )
    }
}

export default InstructorCard