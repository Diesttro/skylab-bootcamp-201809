/**
 * Runs a test suite (a set of independent unit tests)
 * 
 * @param {array} tests - The tests to be run 
 * 
 * @version 1.0.0
 */
function testSuite(tests) {
    tests.forEach(function(test) {
        try {
            test();
        } catch(err) {
            console.error(err.message);
        }
    });
}