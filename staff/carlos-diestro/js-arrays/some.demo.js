// some.demo.js

console.log('DEMO some');

var nums = [1, 2, 3, 4, 5];

var res = some(nums, function(elem) { return elem % 2 === 0; });

console.log(res); // true