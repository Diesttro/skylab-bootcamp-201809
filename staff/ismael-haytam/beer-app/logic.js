function http(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function () {
        var res = JSON.parse(xhr.responseText);

        callback(res);
    });

    xhr.addEventListener("error", function () {
        callback([]);
    });

    xhr.open('get', url);

    xhr.send();
}

function search(query, callback) {
    http('https://quiet-inlet-67115.herokuapp.com/api/search/all?q=' + query, callback);
}

function retrieveBeer(id, callback) {
    http('https://quiet-inlet-67115.herokuapp.com/api/beer/' + id, callback);
}

function $(tag) {
    return document.createElement(tag);
}