
import React, { Component } from 'react'

import Card from './Card'
import Navbar from './Navbar'
import Popup from './Popup'

import template from './templates/Main.pug'


import logicUdacity from '../logic/udacity'
import logicAuth from '../logic/auth'
import logicFilter from '../logic/filter'

class Main extends Component {

    state = {
        courses: [],
        tracks: [],
        coursesToShow: [],
        track: null,
        error: null,
        showPopup: false
    }

    total = 0

    filterCoursesByTrack = (track) => {
        this.setState({ coursesToShow: logicFilter.filterCourses().byTrack(track), track })
    }

    filterCoursesByLevel = (level) => {
        this.setState({ coursesToShow: logicFilter.filterCourses().byLevel(level, this.state.track) })
    }

    filterPersonalized = (event) => {
        this.setState({ coursesToShow: logicFilter.filterCourses().personalized(event.target.value) })
    }

    listCourses = () => {
        try {
            logicUdacity.getCourses()
                .then(() => {
                    const data = logicUdacity._courses
                    this.setState({
                        courses: data.courses || [],
                        tracks: data.tracks || [],
                    })
                    this.loadMore()
                })
                .catch(error => this.setState({ error: error.message }))
        } catch (error) {
            this.setState({ error: error.message })
        }
    }

    loadMore() {
        let coursesToShow = Object.assign({}, this.state.courses)
        this.total += 6
        coursesToShow = Object.values(coursesToShow).splice(0, this.total)
        this.setState({ coursesToShow })
    }

    componentDidMount() {
        this.loadMore()
        window.onscroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                this.loadMore()
            }
        };
    }

    componentWillMount() {
        const data = logicUdacity._courses
        if (data) {
            this.setState({ 
                courses: data.courses || [],
                tracks: data.tracks || [],
            })
        } else {
            this.listCourses();
        }

    }

    render() {

        let card = () => {
            if (this.state.coursesToShow.length > 0) return (this.state.coursesToShow || []).map((course, index) => (<Card course={course} key={index} />))
            return (<div className='card'><p>No results found :/</p></div>)
        } 
        
        let links = (['beginner', 'intermediate', 'advanced']).map((type, index) => <span key={index} onClick={() => this.filterCoursesByLevel(type)}>{type}</span>)

        let track = (this.state.tracks || []).map((track, index) => <span onClick={() => this.filterCoursesByTrack(track)} key={index}>{track.name}</span>)
       
        let popup = (<Popup text='You need to be logged in to view courses!' closePopup={this.togglePopup}/>)

        const {showPopup, error} = this.state
                     
        return template.call(this, {  
            auth: logicAuth.isAuthenticated(), 
            error,     
            links,
            track,
            popup,
            showPopup,
            card: card(),
            Navbar
        });

    }
}

export default Main

