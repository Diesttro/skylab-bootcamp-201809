const logic = require('./logic')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    describe('register', () => {
        let name, surname, username, password

        beforeEach(() => {
            logic._users = []

            name = `name-${Math.random()}`
            surname = `surname-${Math.random()}`
            username = `username-${Math.random()}`
            password = `password-${Math.random()}`
        })

        it('should succeed on correct data', () => {
            logic.registerUser(name, surname, username, password)

            const users = logic._users

            expect(users.length).to.equal(1)

            const [user] = users

            expect(user.name).to.equal(name)
            expect(user.surname).to.equal(surname)
            expect(user.username).to.equal(username)
            expect(user.password).to.equal(password)
        })

        it('should fail on undefined name', () => {
            expect(() => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
        })

        // TODO other test cases
    })

    describe('login', () => {
        let user

        beforeEach(() => {
            user = { name: 'John', surname: 'Doe', username: 'jd', password: '123' }

            logic._users = [user]
        })

        it('should login on correct credentials', () => {
            const { username, password } = user

            logic.loginUser(username, password)

            expect(logic.loggedIn).to.be.true

            const _user = logic._user

            expect(_user.name).to.equal(user.name)
            expect(_user.surname).to.equal(user.surname)
            expect(_user.username).to.equal(username)
            expect(_user.password).to.equal(password)
        })

        it('should fail on undefined username', () => {
            expect(() => logic.loginUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
        })

        // TODO other test cases
    })
})