// Business (logic)?

const logic = {
    createPostit(text) {
        const postit = new Postit(text)

        const postits = this.listPostits()

        postits.push(postit)

        this.persistPostits(postits)
    },

    listPostits() {
        return JSON.parse(storage.getItem('postits'))
    },

    persistPostits(postits) {
        storage.setItem('postits', JSON.stringify(postits))
    },

    deletePostit(id) {
        let postits = this.listPostits()

        postits = postits.filter(postit => postit.id !== id)

        this.persistPostits(postits)
    },

    editPostit(id){
        debugger
        const postits = this.listPostits()
        postit = postits.filter(postit => postit.id == id)
        let element = document.getElementById(id)
        let newtext = element.value
        let index = postits.findIndex(element => element.id ===id)
        // postit.text = newtext
        postits[index].text=newtext
        this.persistPostits(postits)
        // postit.text = element.text
    }
}