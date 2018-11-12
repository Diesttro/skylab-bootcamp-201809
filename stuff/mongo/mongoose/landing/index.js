const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/cats', { useNewUrlParser: true })

// const Cat = mongoose.model('Cat', { name: String })

// 1

// const kitty = new Cat({ name: 'Zildjian' })
// kitty.save().then(() => console.log('meow'))

// 2

// Cat.findOne({ name: 'Zildjian'})
//     .then(cat => {
//         console.log(cat)

//         cat.name = 'Symba'

//         return cat.save()
//     })
//     .then(cat => console.log(cat))

// 3

const Cat = mongoose.model('Cat', { name: String, age: Number })

Cat.findOne({ name: 'Symba' })
    .then(cat => {
        console.log(cat)

        cat.age ? cat.age++ : cat.age = 0

        return cat.save()
    })
    .then(cat => console.log(cat))
    .then(() => Cat.create({ name: `Rudolph-${Date.now()}`, age: 3 }))
    .then(cat => {
        console.log(cat)

        cat.age++

        return cat.save()
    })
    .then(console.log)
    .then(() => Cat.find())
    .then(console.log)