// safe-box.test.js

var tests = [];

tests.push(function() {
    console.log('should succeed saving and retrieving secret on correct password');

    var secret = 'this is my secret';

    safeBox.saveSecret(secret, '123');

    var recovered = safeBox.retrieveSecret('123');

    if (secret !== recovered) throw Error('recovered secret does not match original one');
});

tests.push(function() {
    console.log('should fail saving on wrong password');

    var secret = 'this is my secret';

    var error;

    try {
        safeBox.saveSecret(secret);
    } catch(err) {
        error = err;
    }

    if (!error) throw Error('no error thrown from safe box');

    if (error.message !== 'invalid password') throw Error('error message does not match expected one');
});

testSuite(tests);