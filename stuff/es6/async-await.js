// demo 1

// function addOneAsync(num) {
//     return Promise.resolve()
//         .then(() => ++num)
// }

// function calc() {
//     addOneAsync(0)
//         .then(res => addOneAsync(res))
//         .then(res => addOneAsync(res))
//         .then(res => addOneAsync(res))
//         .then(res => addOneAsync(res))
//         .then(console.log)
// }

// async function calc() {
//     let res = await addOneAsync(0)
//     res = await addOneAsync(res)
//     res = await addOneAsync(res)
//     res = await addOneAsync(res)
//     res = await addOneAsync(res)
//     console.log(res)
// }

// calc()

// demo 2

function addOneAsync(num) {
    return Promise.resolve()
        .then(() => {
            ++num

            if (num > 10) throw Error('out of bounds')

            return num
        })
}

// function calc(num) {
//     return addOneAsync(num)
// }

// calc(19)
//     .then(console.log)
//     .catch(({ message }) => console.log(message))

async function calc(num) {
    let res = await addOneAsync(num)

    res = await addOneAsync(num)
    res = await addOneAsync(num)

    return res
}


// calc(9)
//     .then(console.log)
//     .catch(({ message }) => console.log(message))

// async function run() {
//     try {
//         const res = await calc(10)

//         console.log(res)
//     } catch ({ message }) {
//         console.log(message)
//     }
// }

// run()
// console.log('hello world')

// run()
//  .then(() => console.log('hello world'))

// demo 3

// async function run() {
//     const res = await calc(10)

//     console.log(res)
// }

// run()
//     .then(() => console.log('hello world'))
//     .catch(({message}) => console.error(message))

// demo 4

async function run() {
    const res = await calc(10)

    console.log(res)
}

async function run2() {
    try {
        return await run()
    } catch ({ message }) {
        console.error(message)
    }
}

run2()
    



