const mongoose = require('mongoose')
const { User, Postit } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/postit-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true }, ))

    beforeEach(() => Promise.all([User.deleteMany(), Postit.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password)

                expect(res).to.be.undefined
                
                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.id).to.be.a('string')
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

            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('retrieve', () => {
            let user, postit

            beforeEach(() => {
                postit = new Postit({ text: 'hello text' })
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                return user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, surname, username, password, postits } = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(postits).not.to.exist
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                const result = await logic.updateUser(id, newName, newSurname, newUsername, newPassword, password)
                
                const _users = await User.find()
                
                const [_user] = _users

                expect(_user.id).to.equal(id)

                const { name: _name, surname: _surname, username: _username, password: _password } = _user

                expect(_name).to.equal(newName)
                expect(_surname).to.equal(newSurname)
                expect(_username).to.equal(newUsername)
                expect(_password).to.equal(newPassword)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                const result = await logic.updateUser(id, newName, null, null, null, password)
                const _users = await User.find()
                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                const reuslt = await logic.updateUser(id, null, newSurname, null, null, password)
                const _users = await User.find()
                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(() => {
                    user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                    return user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'
                    
                    try {
                        const result = await logic.updateUser(id, null, null, newUsername, null, password)
                    } catch(err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)

                        const _user = await User.findById(id).lean()

                        expect(_user._id.toString()).to.equal(id)
                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    }
                })
            })
        })
    })

    describe('postits', () => {
        describe('add', () => {
            let user, text

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                text = `text-${Math.random()}`

                //return User.create(user)
                // ALT
                return user.save()
            })

            it('should succeed on correct data', async () => {
                const result = await logic.addPostit(user.id, text)
                
                const postits = await Postit.find()

                const [postit] = postits

                expect(postit.text).to.equal(text)

                expect(postit.user.toString()).to.equal(user.id)
            })

            // TODO other test cases
        })

        describe('list', () => {
            let user, postit, postit2

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', user: user.id })
                postit2 = new Postit({ text: 'hello text 2', user: user.id })

                return user.save()
                    .then(() => postit.save())
                    .then(() => postit2.save())
            })

            it('should succeed on correct data', async () => {
                const postits = await logic.listPostits(user.id)
                
                const _postits = await Postit.find()
                
                expect(_postits.length).to.equal(2)

                expect(postits.length).to.equal(_postits.length)

                const [_postit, _postit2] = _postits

                expect(_postit.id).to.equal(postit.id)
                expect(_postit.text).to.equal(postit.text)

                expect(_postit2.id).to.equal(postit2.id)
                expect(_postit2.text).to.equal(postit2.text)

                const [__postit, __postit2] = postits

                expect(__postit).not.to.be.instanceof(Postit)
                expect(__postit2).not.to.be.instanceof(Postit)

                expect(_postit.id).to.equal(__postit.id)
                expect(_postit.text).to.equal(__postit.text)

                expect(_postit2.id).to.equal(__postit2.id)
                expect(_postit2.text).to.equal(__postit2.text)
            })
        })

        describe('remove', () => {
            let user, postit

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', user: user.id })

                return user.save()
                    .then(() => postit.save())
            })

            it('should succeed on correct data', async () => {
                const result = await logic.removePostit(user.id, postit.id)
                
                const postits = await Postit.find({ _id: postit.id })
                
                expect(postits.length).to.equal(0)
            })
        })

        describe('modify', () => {
            let user, postit, newText

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', user: user.id })

                newText = `new-text-${Math.random()}`
                status = 'DOING'

                return user.save()
                    .then(() => postit.save())
            })

            it('should succeed on correct data', async () => {
                
                const result = await logic.modifyPostit(user.id, postit.id, newText, status)
                // debugger
                const postits = await Postit.find({ _id: postit.id })
                
                expect(postits.length).to.equal(1)

                const [_postit] = postits

                expect(_postit.text).to.equal(newText)
            })
        })

        describe('add/remove friend', () => {
            let user, postit

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                postit = new Postit({ text: 'hello text', user: user.id })

                return user.save()
                    .then(() => postit.save())
                    .then(() => user2.save())
            })

            it('should succeed on add friend', async () => {
                const add = await logic.addFriend(user.id, user2.username)

                const addUserFriend = await User.findById({_id: user.id})

                expect(addUserFriend.id).to.be.equal(user.id)

                expect(addUserFriend.friends.length).to.be.equal(1)

                expect(addUserFriend.friends[0]._id.toString()).to.be.equal(user2.id)
            })

            it('should succeed on remove friend', async () => {
                const del = await logic.removeFriend(user.id, user2.username)

                const userDelFriend = await User.findById({_id: user.id})
                
                expect(userDelFriend.id).to.be.equal(user.id)

                expect(userDelFriend.friends.length).to.be.equal(0)
            })
        })

        describe('add/remove collaborator', () => {
            let user, postit

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                postit = new Postit({ text: 'hello text', user: user.id })

                return user.save()
                    .then(() => postit.save())
                    .then(() => user2.save())
            })

            it('should succeed on add collaborator', async () => {
                const add = await logic.addCollaborator(user.id, postit.id, user2.username)
                
                const addPostit = await Postit.findById({_id: postit.id})
                
                expect(addPostit.id).to.be.equal(postit.id)

                expect(addPostit.collaborators.length).to.be.equal(1)

                expect(addPostit.collaborators[0]._id.toString()).to.be.equal(user2.id)
            })

            it('should succeed on remove collaborator', async () => {
                const del = await logic.removeCollaborator(user.id, postit.id, user2.username)
                
                const delPostit = await Postit.findById({_id: postit.id})
                
                expect(delPostit.id).to.be.equal(postit.id)

                expect(delPostit.collaborators.length).to.be.equal(0)
            })
        })
    })

    after(() => mongoose.disconnect())
})