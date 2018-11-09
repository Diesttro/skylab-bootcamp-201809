const fs = require('fs')
const { expect } = require('chai')
const { User } = require('.')

describe('User (model)', () => {
    before(() => {
        User._file = './data/users.spec.json'
    })

    describe('save', () => {
        let name, surname, username, password

        beforeEach(() => {
            name = `name-${Math.random()}`
            surname = `surname-${Math.random()}`
            username = `username-${Math.random()}`
            password = `password-${Math.random()}`

            fs.writeFileSync(User._file, JSON.stringify([]))
        })

        it('should succeed on correct data', () =>
            new User({ name, surname, username, password }).save()
                .then(() => {
                    const json = fs.readFileSync(User._file)

                    const users = JSON.parse(json)

                    debugger

                    expect(users.length).to.equal(1)

                    const [user] = users

                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.username).to.equal(username)
                    expect(user.password).to.equal(password)
                })
        )

        describe('when user already exists', () => {
            let name, surname, username, password, id

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`

                const user = new User({ name, surname, username, password })

                id = user.id

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should succeed on correct username', () => {
                let json = fs.readFileSync(User._file)

                let users = JSON.parse(json)

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user).to.exist

                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)

                const newName = `${name}-${Math.random()}`

                const _user = new User({ name: newName, surname, username, password })

                _user.id = id

                return _user.save()
                    .then(() => {
                        json = fs.readFileSync(User._file)

                        users = JSON.parse(json)

                        expect(users.length).to.equal(1)

                        user = users[0]

                        expect(user).to.exist

                        expect(user.name).to.equal(newName)
                        expect(user.surname).to.equal(surname)
                        expect(user.username).to.equal(username)
                        expect(user.password).to.equal(password)
                    })
            })
        })
    })

    describe('findByUsername', () => {
        let name, surname, username, password

        beforeEach(() => {
            name = `name-${Math.random()}`
            surname = `surname-${Math.random()}`
            username = `username-${Math.random()}`
            password = `password-${Math.random()}`

            fs.writeFileSync(User._file, JSON.stringify([new User({ name, surname, username, password })]))
        })

        it('should succeed on correct username', () =>
            User.findByUsername(username)
                .then(user => {
                    expect(user).to.exist
                    expect(user).to.be.instanceOf(User)

                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.username).to.equal(username)
                    expect(user.password).to.equal(password)
                })

        )
    })
})