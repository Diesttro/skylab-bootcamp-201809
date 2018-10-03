console.log('TEST forEach');

var tests = [];

tests.push(function () {
    console.log('should succeed on iterating and array (copying it to another array)');

    var nums = [1, 2, 3];

    var res = [];

    forEach(nums, function (num, index) {
        res[index] = num;
    });

    if (res.length !== nums.length) throw Error('result length is not equal to nums length');

    res.forEach(function (val, index) {
        if (val !== nums[index]) throw Error('element at index ' + index + ' does not match the original one');
    });
});

tests.push(function () {
    console.log('should fail on non-function callback');

    var nums = [1, 2, 3];

    var error;

    try {
        forEach(nums);
    } catch (err) {
        error = err;
    }

    if (!error) throw Error('has not failed');

    if (error.message !== 'callback is not a function') throw Error('error message is not correct');
});

tests.push(function () {
    console.log('should fail on non-array and non-callback');

    var error;

    try {
        forEach();
    } catch (err) {
        error = err;
    }

    if (!error) throw Error('has not failed');

    if (error.message !== 'array is not valid') throw Error('error message is not correct');
});

tests.push(function () {
    console.log('should fail on non-array');

    var arr;
    var error;

    try {
        forEach(arr, function () { });
    } catch (err) {
        error = err;
    }

    if (!error) throw Error('has not failed');

    if (error.message !== 'array is not valid') throw Error('error message is not correct');
});

// very rare test! redundant...

tests.push(function () {
    console.log('should succeed on iterating an array or characters and multiplying them for a number');

    var chars = ['a', 'b', 'c'];

    var res = [];

    forEach(chars, function (num, index) {
        res[index] = num * 2;
    });

    if (res.length !== chars.length) throw Error('result length is not equal to characters length');

    res.forEach(function (val, index) {
        if (!isNaN(val)) throw Error('element at index ' + index + ' does not match NaN');
    });
});

tests.push(function () {
    console.log('should succeed on iterating an array and passing all specified data to callback');

    var chars = ['a', 'b', 'c'];

    var elements = [];
    var indexes = [];
    var arrays = [];

    forEach(chars, function (element, index, array) {
        elements.push(element);
        
        indexes.push(index);

        arrays.push(array);
    });

    if (elements.length !== chars.length) throw Error('elements length is not equal to chars length');

    if (indexes.length !== chars.length) throw Error('indexes length is not equal to chars length');

    if (arrays.length !== chars.length) throw Error('arrays length is not equal to chars length');

    elements.forEach(function (elem, index) {
        if (elem !== chars[index]) throw Error('element at index ' + index + ' does not match ' + chars[index]);
    });

    indexes.forEach(function (i, index) {
        if (i !== index) throw Error('index at index ' + index + ' does not match ' + index);
    });

    arrays.forEach(function(array) {
        if (array !== chars) throw Error('array does not match original one');
    });
});

testSuite(tests);