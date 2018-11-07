import data from './data'

const { storage, Postit, User } = data

const logic = {
    createPostit(text) {
        const postit = new Postit(text)

        const postits = this.listPostits()

        const users = this.listUsers()

        let indexuser = users.findIndex(element => element.activated === true)

        postit.userid =users[indexuser].id

        postits.push(postit)

        this._persistPostits(postits)
    },

    listPostits() {
        return JSON.parse(storage.getItem('postits'))
    },

    listPostitsUser(){
        const users = this.listUsers()
        let index = users.findIndex(element => element.activated === true)
        let id = users[index].id
        let postits = this.listPostits()
        debugger
        postits = postits.filter(postit => postit.userid === id)
        return postits
        
    },

    _persistPostits(postits) {
        storage.setItem('postits', JSON.stringify(postits))
    },

    deletePostit(id) {
        let postits = this.listPostits()

        postits = postits.filter(postit => postit.id !== id)

        this._persistPostits(postits)
    },

    editPostit(id){
        
        const postits = this.listPostits()
        // postit = postits.filter(postit => postit.id == id)
        let element = document.getElementById(id)
        let newtext = element.value
        let index = postits.findIndex(element => element.id ===id)
        // postit.text = newtext
        postits[index].text=newtext
        
       

        this._persistPostits(postits)
        // postit.text = element.text
    },

    listUsers() {
        return JSON.parse(storage.getItem('users'))
    },

    _persistUsers(users) {
        storage.setItem('users', JSON.stringify(users))
    },

    registerUser(name, surname, username, password) {
        const user = new User(name, surname, username, password)

        const users = this.listUsers()

        users.push(user)

        this._persistUsers(users)
    },

    loginUser(username, password){
        const users = this.listUsers()

        let index = users.findIndex(element => element.username === username)

        if (users[index].password === password) {
            users[index].activated = true
            this._persistUsers(users)
            return (true)
        }
    },

    logout(){
        debugger
         const users = this.listUsers()

         let index = users.findIndex(element => element.activated === true)
        
         users[index].activated = false

         this._persistUsers(users)

     }
}

export default logic