

var form = document.getElementById('search-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    var input = document.getElementById('search-query');

    search(input.value, function (beers) {
        var uls = document.getElementsByTagName('ul');

        if (uls.length) document.body.removeChild(uls[0]);
        

        if (beers.length) {
            var ul = $('ul');

            beers.forEach(function (beer) {
                var toggle = false;
                var li = $('li');
                var a = $('a');
                var section = $('section');
                var img = $('img');
                var h1 = $('h1');
                var p = $('p');
                a.href = '#';
                a.onclick = function() {
                    section.appendChild(h1);
                    section.appendChild(p);
                    section.appendChild(img);
                    li.appendChild(section);
                    if (toggle) { 
                        toggle = false;   
                        return section.innerHTML = '';
                    }
                    retrieveBeer(beer.id, function(info) {
                        toggle = true;
                        h1.innerText = info.name;
                        p.innerText = info.description;
                        img.src = (info.labels) ? info.labels.medium : 'https://via.placeholder.com/140x100';
                    });
                }
                a.innerText = beer.name + ' ' + (beer.id);
                li.appendChild(a);


                ul.appendChild(li);
            });

            document.body.appendChild(ul);
        } else alert('no results');

    });
});