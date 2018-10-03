// find.demo.js

console.log('DEMO find');

var nums = [5, 12, 8, 130, 44];

var res = find(nums, function(elem) { return elem > 10; });

console.log(res); // 12