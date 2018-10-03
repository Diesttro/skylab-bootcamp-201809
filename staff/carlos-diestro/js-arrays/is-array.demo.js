// is-array.demo.js

console.log('isArray demo');

console.log(isArray([1, 2, 3]));    // true
console.log(isArray({foo: 123}));   // false
console.log(isArray('foobar'));     // false
console.log(isArray(undefined));    // false