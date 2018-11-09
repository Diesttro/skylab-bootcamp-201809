const { MongoClient } = require('mongodb')

const MONGO_URL = 'mongodb://localhost:27017'

const client = new MongoClient(MONGO_URL, { useNewUrlParser: true })

client.connect(err => {
    if (err) throw err

    const db = client.db('skylab')

    const users = db.collection('users')

    users.deleteMany({}, err => {
        if (err) throw err

        users.insertOne({ name: 'Pepe', surname: 'Grillo' }, (err, res) => {
            if (err) throw err

            users.updateOne({ name: 'Pepe' }, { $set: { surname: 'Doe' } }, err => {
                if (err) throw err

                users.find().toArray()
                    .then(users => {

                        console.log(users)

                        // client.close()
                    })

                const cursor = users.find()

                cursor.toArray()
                    .then(users => console.log(users))

                cursor.each((err, res) => {
                    console.log(res)
                })

                // client.close()
            })
        })
    })
})