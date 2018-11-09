import React, { Component } from 'react'
import Card from './Card'
import Navbar from './Navbar'

import logicAuth from '../logic/auth'
import logicUdacity from '../logic/udacity'


class Profile extends Component {
    state = {
        courses: logicUdacity._courses,
        favorites: logicAuth._user,
        faves: []
    }

    componentWillMount() {
      
        if (!logicAuth.isAuthenticated()) this.props.history.push('/')
 
     }


    getFavorites() {
        let faves = []
        if (logicAuth.isAuthenticated()) {
                this.state.favorites.data.faves.forEach(fave => {
                faves.push(Object.values(this.state.courses.courses).find(course => course.slug === fave.course))
            })
        }
        return faves
    }

    render() {

        return (
            <div>
            <Navbar />
            <div className="main list-container">
                <div className="cards-container" >
                    {(this.getFavorites()).map((course, index) => <Card course={course} key={index} />)}
                    {this.getFavorites().length === 0 &&
                        <p>You do not have any favorites courses</p>
                    }
                </div>
            </div>
            </div>


        )
    }
}

export default Profile
