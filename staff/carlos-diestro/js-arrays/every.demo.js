// every.demo.js

console.log('DEMO every');

var values = [1, 30, 39, 29, 10, 13];

var res = every(values, function(elem) { return elem < 40; });

console.log(res); // true