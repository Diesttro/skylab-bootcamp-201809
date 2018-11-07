// Business (logic)

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

    updatePostit(id, text) {
        let postits = this.listPostits()

        const postit = postits.find(postit => postit.id === id)

        postit.text = text

        this.persistPostits(postits)
    }
}