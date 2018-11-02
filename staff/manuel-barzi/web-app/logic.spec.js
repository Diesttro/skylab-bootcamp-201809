const fs = require('fs')
const { User } = require('./data')
const logic = require('./logic')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => {
        User._file = './data/users.spec.json'
    })

    describe('register', () => {
        let name, surname, username, password

        beforeEach(() => {
            fs.writeFileSync(User._file, JSON.stringify([]))

            name = `name-${Math.random()}`
            surname = `surname-${Math.random()}`
            username = `username-${Math.random()}`
            password = `password-${Math.random()}`
        })

        it('should succeed on correct data', () => {
            debugger
            logic.registerUser(name, surname, username, password)

            const json = fs.readFileSync(User._file)

            const users = JSON.parse(json)

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

    describe('authenticate', () => {
        let user

        beforeEach(() => {
            user = new User('John', 'Doe', 'jd', '123')

            fs.writeFileSync(User._file, JSON.stringify([user]))
        })

        it('should authenticate on correct credentials', () => {
            const { username, password } = user

            const id = logic.authenticateUser(username, password)

            expect(id).to.exist
            expect(id).to.be.a('number')

            const json = fs.readFileSync(User._file)

            const users = JSON.parse(json)

            const [_user] = users

            expect(_user.id).to.equal(id)
        })

        it('should fail on undefined username', () => {
            expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
        })

        // TODO other test cases
    })

    describe('retrieve', () => {
        let user

        beforeEach(() => {
            user = new User('John', 'Doe', 'jd', '123')

            fs.writeFileSync(User._file, JSON.stringify([user]))
        })

        it('should succeed on valid id', () => {
            const _user = logic.retrieveUser(user.id)

            expect(_user).to.be.instanceof(User)

            const { id, name, surname, username, password } = _user

            expect(id).to.exist
            expect(id).to.equal(user.id)
            expect(name).to.equal(user.name)
            expect(surname).to.equal(user.surname)
            expect(username).to.equal(user.username)
            expect(password).to.be.undefined
        })
    })
})