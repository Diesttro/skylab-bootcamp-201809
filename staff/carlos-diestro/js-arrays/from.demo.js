// from.demo.js

console.log('from demo');

console.log(from('foo'));
// ["f", "o", "o"]

console.log(from([1, 2, 3], function(x) { return x + x; }));
// [2, 4, 6]

var a = [1, 2, 3];

var b = from(a);

console.log(a); // [1, 2, 3]
console.log(b); // [1, 2, 3]
console.log(a === b); // false