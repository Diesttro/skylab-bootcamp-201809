function buildView(body) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Hello World!</title>
            <link rel="stylesheet" href="/vendor/bootstrap/4.1.3/css/bootstrap.min.css">
            <link rel="stylesheet" type="text/css" href="/styles/main.css">
            <link href="/images/favicon.png" type="image/png" rel="Shortcut Icon">
        </head>
        <body>
            <div class="container">
                <h1 class="title">Hello World!</h1>
                ${body}
            </div>
            <script src="/vendor/jquery/3.3.1/jquery-3.3.1.slim.min.js"></script>
            <script src="/vendor/popper/1.14.3/popper-1.14.3.min.js"></script>
            <script src="/vendor/bootstrap/4.1.3/js/bootstrap.min.js"></script>
        </body>
    </html>`
}

module.exports = buildView