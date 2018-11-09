const { MongoClient } = require('mongodb')

const MONGO_URL = 'mongodb://localhost:27017'

const client = new MongoClient(MONGO_URL, { useNewUrlParser: true })

client.connect(err => {
    if (err) throw err

    const db = client.db('skylab')

    const users = db.collection('users');

    (async () => {
        await deleteAll(users)
        await insertUser(users, 'Jack', 'Stripper')
        await insertUser(users, 'John', 'Doe')
        await insertUser(users, 'Mariah', 'Carey')
        let _users = await findAll(users)
        console.log(_users)
        await updateUser(users, 'Mariah', 'Carey', 'Anna', 'Torroja')
        _users = await findAll(users)
        console.log(_users)
        await deleteAll() // forced error!
    })()
        .catch(({ message }) => console.error(message))
        .then(() => console.log('ok, done!'))
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