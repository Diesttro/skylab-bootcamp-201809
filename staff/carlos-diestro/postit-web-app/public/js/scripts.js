function edit(event) {
  if (event.currentTarget.type === 'button') {
    event.preventDefault()

    event.currentTarget.children[0].className = 'far fa-save'
    event.currentTarget.type = 'submit'

    const paragraph = event.currentTarget.nextSibling
    
    const textarea = document.createElement('textarea')
    textarea.name = 'text'
    textarea.value = paragraph.innerText

    paragraph.replaceWith(textarea)
  }
}