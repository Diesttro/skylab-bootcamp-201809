// Data - Model (domain)

export const storage = sessionStorage
// const storage = localStorage

if (!storage.getItem('postits'))
    storage.setItem('postits', JSON.stringify([]))

// function Postit(text) {
//     this.text = text
//     this.id = Date.now()
// }

export class Postit {
    constructor(text) {
        this.text = text
        this.id = Date.now()
    }
}



// export default {
//     storage,
//     Postit
// }

// module.exports = {
//     storage,
//     Postit
// }
