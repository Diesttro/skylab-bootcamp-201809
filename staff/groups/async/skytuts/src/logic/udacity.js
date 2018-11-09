
const logicUdacity = {
    _courses: JSON.parse(sessionStorage.getItem('courses')) || null,

    getCourses(url = 'https://www.udacity.com/public-api/v0/courses') {
        return fetch(url).then(response => {
            return response.json()
        }).then(data => {
            this._courses = data
            sessionStorage.setItem('courses', JSON.stringify(data))
            return this._courses
        })
            .catch(err => {
                if (err) throw Error('Unable to load courses')
            })

    }
}

// export default logicUdacity
module.exports = logicUdacity