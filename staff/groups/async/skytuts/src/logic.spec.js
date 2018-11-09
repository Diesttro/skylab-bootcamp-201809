
// import logic from './logic'

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const logicAuth = require('./logic/auth')

const logicUdacity = require('./logic/udacity')

const logicFilter = require('./logic/filter')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logicAuth', () => {
    describe('users', () => {
        describe('register', () => {
            it('should succeed on correct data', () =>
                logicAuth.registerUser('John', 'Doe', `jd-${Math.random()}`, '123')
                    .then(() => expect(true).to.be.true)
            )

            it('should fail on trying to register twice same user', () => {
                const username = `jd-${Math.random()}`

                return logicAuth.registerUser('John', 'Doe', username, '123')
                    .then(() => logicAuth.registerUser('John', 'Doe', username, '123'))
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`user with username "${username}" already exists`)
                    })
            })

            it('should fail on undefined name', () => {
                expect(() =>
                    logicAuth.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string')
            })

        })


        describe('login', () => {
            describe('with existing user', () => {
                let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logicAuth.registerUser(name, surname, username, password)
                })

                it('should succeed on correct data', () =>
                    logicAuth.login(username, password)
                        .then(() => expect(true).to.be.true)
                )

                it('should fail on wrong username', () => {
                    username = `dummy-${Math.random()}`

                    return logicAuth.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`user with username "${username}" does not exist`)
                        })
                })

                it('should fail on wrong password', () => {
                    password = 'pepito'

                    return logicAuth.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal('username and/or password wrong')
                        })
                })
            })

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logicAuth.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logicAuth.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logicAuth.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

        })
    })
})


describe('get user', () => {
    let username, password

    it('return correct user information', () => {
        const name = 'John', surname = 'Doe'

        username = `jd-${Math.random()}`
        password = `123-${Math.random()}`

        return logicAuth.registerUser(name, surname, username, password)
            .then(() => {
                logicAuth.login(username, password).then(() => {
                    logicAuth.getUser().then(res => expect(username).to.equal(res.data.username))
                })
            })
    })

})


describe('logout', () => {
    let username, password

    it('should logout user', () => {
        const name = 'John', surname = 'Doe'

        username = `jd-${Math.random()}`
        password = `123-${Math.random()}`

        return logicAuth.registerUser(name, surname, username, password)
            .then(() => {
                logicAuth.login(username, password)
                    .then(() => expect(logicAuth.logout()).to.equal('session cleared'))
            })
    })

})

describe('logicUdacity', () => {
    describe('connect to the API', () => {
        it('should fetch courses', () => {
            return logicUdacity.getCourses()
                .then(res => {
                    expect(res).to.be.an('object')
                })
        })

        it('should fail on incorrect URL', () => {
            return logicUdacity.getCourses('https://www.fake-udacity.com/public-api/v0/courses')
                .then(() => {
                    expect(false).to.be.true
                })
                .catch(err => {
                    expect(err.message).to.equal('Unable to load courses')
                })
        })
    })

})

describe('filter', () => {

    let courses

    beforeEach(() => {

        return logicUdacity.getCourses().then(res => courses = res)

    })


    describe('by level', () => {
        it('should filter course by level (advanced)', () => {

            let result = logicFilter.filterCourses(courses).byLevel('advanced');
            expect(result.length).to.equal(41)
   
       })
   
       it('should filter course by level (intermediate)', () => {
   
           let result = logicFilter.filterCourses(courses).byLevel('intermediate');
           expect(result.length).to.equal(102)
   
       })
   
      it('should filter course by level (beginner)', () => {
   
           let result = logicFilter.filterCourses(courses).byLevel('beginner');
           expect(result.length).to.equal(52)
   
       })
    })
    

    describe('by query', () => {
        it('should filter by personalized query (ios)', () => {

            let result = logicFilter.filterCourses(courses).personalized('ios');
            expect(result.length).to.equal(10)
            expect(result[0].title).to.equal('Firebase Analytics: iOS')
    
        })
    
        it('should filter by personalized query (react)', () => {
    
            let titles = ['React Native', 'React & Redux', 'React Fundamentals']
    
            let result = logicFilter.filterCourses(courses).personalized('react');
            expect(result.length).to.equal(3)
            titles.forEach((title, i) =>  expect(result[i].title).to.equal(title))
    
        })
    
        it('should filter by personalized query with special characters (c++)', () => {
    
            let result = logicFilter.filterCourses(courses).personalized('c++');
            expect(result.length).to.equal(1)
            expect(result[0].title).to.equal('C++ For Programmers')
        })
    
        it('should not return unavailable courses on unmatched query', () => {
            let query = `data-${Math.random()}`
            let result = logicFilter.filterCourses(courses).personalized(query);
            expect(result.length).to.equal(0)
        })
    
        it('should return all new released coureses', () => {
            let result = logicFilter.filterCourses(courses).personalized('new');
            expect(result.length).to.equal(38)
        })
    })

    describe('by track', () => {
        it('should filter courses by track', () => {

            let androidTrack = courses.tracks[3]
    
            let result = logicFilter.filterCourses(courses).byTrack(androidTrack);
            expect(result.length).to.equal(26)
            expect(result[0].title).to.equal('Firebase Analytics: Android')
        })
    
        it('should filter courses by track', () => {
    
            let dataScience = courses.tracks[0]
    
            let result = logicFilter.filterCourses(courses).byTrack(dataScience);
            expect(result.length).to.equal(17)
            expect(result[0].title).to.equal('Intro to Computer Science')
        })
    })

})
