// Model (domain) - Data

const storage = sessionStorage
// const storage = localStorage

if (!storage.getItem('postits'))
    storage.setItem('postits', JSON.stringify([]))

// function Postit(text) {
//     this.text = text
//     this.id = Date.now()
// }

class Postit {
    constructor(text) {
        this.text = text
        this.id = Date.now()
    }
}