function buildView(body) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <title>Hello World!</title>
        </head>
        <body>
            <h1 style="color: green">Hello World!</h1>
            ${body}
        </body>
    </html>`
}

module.exports = buildView