//import logic from './logic'

require('isomorphic-fetch')

const logic = require('./logic')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    false && describe('users', () => {
        describe('register', () => {
            it('should succeed on correct data', () =>
                logic.registerUser('John', 'Doe', `jd-${Math.random()}`, '123')
                    .then(id => expect(id).to.be.a('string'))
            )

            it('should fail on trying to register twice same user', () => {
                const username = `jd-${Math.random()}`

                return logic.registerUser('John', 'Doe', username, '123')
                    .then(id => {
                        expect(id).to.be.a('string')

                        return logic.registerUser('John', 'Doe', username, '123')
                    })
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`user with username "${username}" already exists`)
                    })
            })

            it('should fail on undefined name', () => {
                expect(() =>
                    logic.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other cases
        })

        describe('authenticate', () => {
            describe('with existing user', () => {
                let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                })

                it('should succeed on correct data', () =>
                    logic.authenticate(username, password)
                        .then(({ id, token }) => {
                            expect(id).to.be.a('string')
                            expect(token).to.be.a('string')
                        })
                )

                it('should fail on wrong username', () => {
                    username = `dummy-${Math.random()}`

                    return logic.authenticate(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`user with username "${username}" does not exist`)
                        })
                })

                it('should fail on wrong password', () => {
                    password = 'pepito'

                    return logic.authenticate(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal('username and/or password wrong')
                        })
                })
            })

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logic.authenticate(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logic.authenticate(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logic.authenticate(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            // TODO other cases
        })
    })

    describe('postits', () => {
        false && describe('create', () => {
            describe('with existing user', () => {
                let username, password, userId, _token, text

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.authenticate(username, password))
                        .then(({ id, token }) => {
                            userId = id
                            _token = token
                        })
                })

                it('should succeed on correct data', () =>
                    logic.createPostit(text, userId, _token)
                        .then(() => expect(true).to.be.true)
                )
            })
        })

        false && describe('list', () => {
            describe('with existing user', () => {
                let username, password, userId, _token, text

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.authenticate(username, password))
                        .then(({ id, token }) => {
                            userId = id
                            _token = token
                        })
                })

                describe('with existing postit', () => {
                    beforeEach(() => logic.createPostit(text, userId, _token))

                    it('should return postits', () =>
                        logic.listPostitsByUser(userId, _token)
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)
                            })
                    )
                })

                it('should return no postits', () =>
                    logic.listPostitsByUser(userId, _token)
                        .then(postits => {
                            expect(postits).not.to.be.undefined
                            expect(postits.length).to.equal(0)
                        })
                )
            })
        })

        describe('delete', () => {
            describe('with existing user', () => {
                let username, password, userId, _token, text, postitId

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.authenticate(username, password))
                        .then(({ id, token }) => {
                            userId = id
                            _token = token
                        })
                })

                describe('with existing postit', () => {
                    beforeEach(() => 
                        logic.createPostit(text, userId, _token)
                            .then(() => logic.listPostitsByUser(userId, _token))
                            .then(postits => postitId = postits[0].id)
                    )

                    it('should succeed', () =>
                        logic.deletePostit(postitId, userId, _token)
                            .then(() => expect(true).to.be.true)
                    )
                })
            })
        })
        false && describe('update', () => {
            describe('with existing user', () => {
                let username, password, userId, _token, text, postitId

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.authenticate(username, password))
                        .then(({ id, token }) => {
                            userId = id
                            _token = token
                        })
                })

                describe('with existing postit', () => {
                    beforeEach(() => 
                        logic.createPostit(text, userId, _token)
                            .then(() => logic.listPostitsByUser(userId, _token))
                            .then(postits => postitId = postits[0].id)
                    )

                    it('should succeed', () =>
                        logic.deletePostit(postitId, userId, _token)
                            .then(() => expect(true).to.be.true)
                    )
                })
            })
        })
    })
})