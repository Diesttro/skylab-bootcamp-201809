// ayay.test.js

(function() {
    console.log('TEST Ayay.prototype.push');
    
    var tests = [];
    
    tests.push(function() {
        console.log('should push values in ayay');

        var ayay = new Ayay();

        ayay.push(1);
        ayay.push(2);
        ayay.push(3);

        if (ayay.length !== 3) throw Error('ayay length does not match expected one: ' + ayay.length);

        for (var i = 0; i < ayay.length; i++) 
            if (ayay[i] !== i + 1) throw Error('item does not match expected at position: ' + i);
    });

    // TODO add more test cases
    
    testSuite(tests);
})();

(function() {
    console.log('TEST Ayay.prototype.forEach');
    
    var tests = [];
    
    tests.push(function() {
        console.log('should iterate on valid ayay');

        var ayay = new Ayay();

        ayay.push(1);
        ayay.push(2);
        ayay.push(3);

        var result = [];

        ayay.forEach(function(elem, index) { result[index] = elem * 2; });

        if (result.length !== ayay.length) throw Error('result length does not match expected one: ' + result.length);

        result.forEach(function(elem, index) {
            if (elem !== ayay[index] * 2) throw Error('item does not match expected one, at position: ' + index);
        });
    });
    
    testSuite(tests);
})();

(function() {
    console.log('TEST Ayay.prototype.pop');
    
    var tests = [];
    
    tests.push(function() {
        console.log('should pop values in ayay');

        var ayay = new Ayay();

        ayay.push(1);
        ayay.push(2);
        ayay.push(3);

        ayay.pop();

        if (ayay.length !== 2) throw Error('ayay length does not match expected one: ' + ayay.length);

        for (var i = 0; i < ayay.length; i++) 
            if (ayay[i] !== i + 1) throw Error('item does not match expected at position: ' + i);
    });
    
    testSuite(tests);
})();

(function() {
    console.log('TEST Ayay.prototype.pop');
    
    var tests = [];
    
    tests.push(function() {
        console.log('should not pop values in ayay if is empty');

        var ayay = new Ayay();

        ayay.pop();

        if (ayay.length !== 0) throw Error('ayay length does not match expected one: ' + ayay.length);
    });
    
    testSuite(tests);
})();