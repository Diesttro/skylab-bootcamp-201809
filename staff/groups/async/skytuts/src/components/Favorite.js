import React, { Component } from 'react'

import logicAuth from '../logic/auth'




class Favorite extends Component {
    state = {
        faves: {},
        token: logicAuth._token,
        userId: logicAuth._userId,
        status: '',
        error: null
    }

    checkStatus() {
        if (logicAuth._user) {
            let favesLocal = logicAuth._user.data.faves
            let found = favesLocal.find(element => element.course === this.props.params)
            const status = (found) ? '../images/star-active.svg' : '../images/star.png'
            this.setState({ status })
        }
    }


    componentDidMount() {
        this.checkStatus()
    }

    markAsFavorite() {

        let favesLocal = logicAuth._user.data.faves
        let found = favesLocal.find(element => element.course === this.props.params)
        if (found) {
            favesLocal = favesLocal.filter(element => element.course !== this.props.params)
        } else {
            favesLocal.push({ course: this.props.params })
        }

        try {
            logicAuth.updateUser(favesLocal)
                .then(() => this.checkStatus())
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }

    }


    render() {
        return <img alt='favorites' className='star' src={this.state.status} onClick={() => this.markAsFavorite()}></img>
    }
}

export default Favorite