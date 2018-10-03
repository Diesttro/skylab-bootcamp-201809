// splice.demo.js

console.log('DEMO splice');

var months = ['Jan', 'March', 'April', 'June'];

var removed = splice(months, 1, 2);

console.log(months); // ["Jan", "June"]
console.log(removed); // ["March", "April"]