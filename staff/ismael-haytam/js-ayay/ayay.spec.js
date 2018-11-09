describe('Ayay', function () {
    var ayay;

    beforeEach(function () {
        ayay = new Ayay;
    });

    describe('push', function () {

        it('should push items', function () {
            ayay.push(1);
            ayay.push(2);
            ayay.push(3);

            expect(ayay.length).toEqual(3);

            for (var i = 0; i < ayay.length; i++) expect(ayay[i]).toEqual(i + 1);
        });

        it('should return ayay length if element is not defined', function () {

            ayay.push(1);
            ayay.push(2);

            var result = ayay.push();

            expect(result === ayay.length).toBe(true);
            expect(result).toEqual(2);

        });

        it('should push an ayay in ayay', function () {

            ayay.push(['Hello!']);

            expect(ayay.length).toEqual(1);
            expect(ayay[0].length).toEqual(1);
            expect(ayay[0][0]).toEqual('Hello!');

        });

    });

    describe('forEach', function () {

        it('should iterate on valid ayay', function () {
            ayay.push(1);
            ayay.push(2);
            ayay.push(3);

            var result = [];

            ayay.forEach(function (elem, index) { result[index] = elem * 2; });

            expect(result.length).toEqual(ayay.length);

            result.forEach(function (elem, index) {
                expect(elem).toEqual(ayay[index] * 2);
            });
        });

        it('should fail on non-function callback', function () {

            ayay.push('argument');

            expect(function () {
                ayay.forEach();
            }).toThrowError(TypeError, 'undefined is not a function');

        });

        it('should fail when argument is not a function (Number)', function () {

            expect(function () {
                ayay.forEach('Lorem');
            }).toThrowError(TypeError, 'Lorem is not a function');

        });

    });


    describe('sort', function () {

        it('should return a array sorted (Numbers)', function () {
            ayay.push(1);
            ayay.push(30);
            ayay.push(4);
            ayay.push(21);

            ayay.sort();

            expect(ayay.length).toEqual(4);
            expect(ayay[0]).toEqual(1);
            expect(ayay[1]).toEqual(21);
            expect(ayay[2]).toEqual(30);
            expect(ayay[3]).toEqual(4);
        })

        it('should return a array sorted (Strings)', function () {
            ayay.push('March');
            ayay.push('Jan');
            ayay.push('Feb');
            ayay.push('Dec');

            ayay.sort();

            expect(ayay.length).toEqual(4);
            expect(ayay[0]).toEqual('Dec');
            expect(ayay[1]).toEqual('Feb');
            expect(ayay[2]).toEqual('Jan');
            expect(ayay[3]).toEqual('March');
        })

        it('should modify the original array', function () {

            ayay.push('lorem');
            ayay.push('ipsum');

            var sorted = ayay.sort();

            expect(ayay === sorted).toBe(true);
            expect(ayay[0] + ayay[1]).toEqual('ipsumlorem');

        });

    });


    describe('find', function () {

        it('should fail when non-callback', function () {

            expect(function () {
                ayay.find();
            }).toThrowError(TypeError, 'undefined is not a function');

        });


        it('should succeed on find element', function () {

            // ayay.push(1);
            // ayay.push(2);
            // ayay.push(3);
            // ayay.push(4);

            // var result = ayay.find(function (elem) { return elem >= 3; });

            // expect(result.length).toEqual(2);
            // expect(result[0]).toEqual(3);
            // expect(result[1]).toEqual(4);

        });

        it('should fail when argument is not a function (String)', function () {

            expect(function () {
                ayay.find('string');
            }).toThrowError(TypeError, 'string is not a function');

        });

    });


    describe('map', function () {


        it('should fail when non-callback', function () {

            expect(function () {
                ayay.map();
            }).toThrowError(TypeError, 'undefined is not a function');

        });

        it('should succeed on iterating an array and multiply by 2', function () {


            ayay.push(6);
            ayay.push(12);

            var result = [];

            ayay.map(function (element, index) {
                result[index] = element * 2;
            });

            expect(result[0]).toEqual(12);
            expect(result[1]).toEqual(24);


        });


        it('should fail when argument is not a function (String)', function () {

            expect(function () {
                ayay.map('string');
            }).toThrowError(TypeError, 'string is not a function');

        });


        describe('pop', function () {

            it('should sucessfully return popped item', function () {

                ayay.push('lorem');
                ayay.push('ipsum');

                var removed = ayay.pop();

                expect(removed).toEqual('ipsum');

            });

            it('should return 0 when array is empty', function () {

                var totalRemoved = ayay.pop();

                expect(totalRemoved).toEqual(0);

            });

        });


    });


});