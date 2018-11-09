const { MongoClient } = require('mongodb')

const MONGO_URL = 'mongodb://localhost:27017'

const client = new MongoClient(MONGO_URL, { useNewUrlParser: true })

client.connect(err => {
    if (err) throw err

    const db = client.db('skylab')

    const users = db.collection('users')

    deleteAll(users)
        .then(() => {
            const insertions = [
                insertUser(users, 'Jack', 'Stripper'),
                insertUser(users, 'John', 'Doe'),
                insertUser(users, 'Mariah', 'Carey')
            ]

            return Promise.all(insertions)
        })
        .then(() => findAll(users))
        .then(console.log)
        .then(() => updateUser(users, 'Mariah', 'Carey', 'Anna', 'Torroja'))
        .then(() => findAll(users))
        .then(console.log)
})

function findAll(collection) {
    return collection.find().toArray()
}

function deleteAll(collection) {
    return new Promise((resolve, reject) => {
        collection.deleteMany({}, (err, res) => {
            if (err) return reject(err)

            resolve(res)
        })
    })
}

function insert(collection, document) {
    return new Promise((resolve, reject) => {
        collection.insertOne(document, (err, res) => {
            if (err) return reject(err)

            resolve(res)
        })
    })
}

function update(collection, filter, changes) {
    return new Promise((resolve, reject) => {
        collection.update(filter, changes, (err, res) => {
            if (err) return reject(err)

            resolve(res)
        })
    })
}

function insertUser(users, name, surname) {
    return insert(users, { name, surname })
}

function updateUser(users, name, surname, newName, newSurname) {
    return update(users, { name, surname }, { $set: { name: newName, surname: newSurname } })
}

function insertCar(cars, brand, model) {
    return insert(cars, { brand, model })
}