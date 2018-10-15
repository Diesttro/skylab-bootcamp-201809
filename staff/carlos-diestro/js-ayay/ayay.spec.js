describe('Ayay', function () {
  var ayay;

  beforeEach(function() {
    ayay = new Ayay;
  });

  describe('push', function () {
    it('should not push elements if none is passed', function () {
      var result = ayay.push();

      expect(ayay.length).toEqual(0);
      expect(result).toEqual(0);
    });

    it('should push all elements passed', function () {
      ayay.push(1, 2, 3);

      expect(ayay.length).toEqual(3);

      ayay.forEach(function (element, index) {
        expect(element).toEqual(index + 1);
      });
    });
  });

  describe('pop', function () {
    it('should not pop an element if is empty', function () {
      var popped = ayay.pop();

      expect(ayay.length).toEqual(0);
      expect(popped).toEqual(undefined);
    });

    it('should pop the last element', function () {
      ayay.push(1, 2, 3);

      var popped = ayay.pop();

      expect(ayay.length).toEqual(2);
      expect(popped).toEqual(3);
    });
  });

  describe('forEach', function () {
    it('should fail if no function is passed', function () {
      expect(function() {
        ayay.forEach();
      }).toThrowError('undefined is not a function');
    });

    it('should fail if other thing than a function is passed', function () {
      expect(function() {
        ayay.forEach(1);
      }).toThrowError('1 is not a function');
    });

    it('should iterate on Ayay', function () {
      ayay.push(1, 2, 3);

      ayay.forEach(function (element, index) {
        expect(element).toEqual(index + 1);
      });
    });
    
    it('should copy an Ayay to another Ayay', function () {
      ayay.push(1, 2, 3);

      var result = new Ayay;

      ayay.forEach(function (element, index) {
        result.push(element * 2);
      });

      expect(result.length).toEqual(ayay.length);

      result.forEach(function (element, index) {
        expect(element).toEqual(ayay[index] * 2);
      });
    });

  });

  describe('map', function () {
    it('should fail if no function is passed', function () {
      expect(function() {
        ayay.map();
      }).toThrowError('undefined is not a function');
    });

    it('should iterate on valid Ayay and return another Ayay with expected values', function () {
      ayay.push(1, 2, 3);

      var result = ayay.map(function (elem, index) { return elem * 2; });

      expect(result instanceof Ayay).toBeTruthy();
      expect(result.length).toEqual(ayay.length);

      result.forEach(function (elem, index) {
        expect(elem).toEqual(ayay[index] * 2);
      });
    });

  });

  describe('filter', function () {
    it('should fail if no function is passed', function () {
      expect(function() {
        ayay.filter();
      }).toThrowError('undefined is not a function');
    });

    it('should iterate on valid Ayay and return another Ayay', function () {
      ayay.push(1, 2, 3);

      var result = ayay.filter(function (elem) { return elem > 2; });

      expect(result instanceof Ayay).toBeTruthy();
      expect(result[0]).toEqual(3);
    });
  });

  describe('find', function () {
    it('should fail if no function is passed', function () {
      expect(function() {
        ayay.find();
      }).toThrowError('undefined is not a function');
    });

    it('should find and return the first coincidence', function () {
      ayay.push(1, 2, 3);

      var result = ayay.find(function (elem) { return elem > 1; });

      expect(result).toEqual(ayay[1]);
    });

    it('should return undefined if no coincidence', function () {
      ayay.push(1, 2, 3);

      var result = ayay.find(function (elem) { return elem > 3; });

      expect(result).toEqual(undefined);
    });
  });

  describe('sort', function () {
    it('should sort the properties by value', function () {
      ayay.push('c', 'a', 'b');

      result = ['a', 'b', 'c'];

      ayay.sort();

      expect(ayay.length).toEqual(result.length);

      result.forEach(function (element, index) {
        expect(element).toEqual(ayay[index]);
      });
    });
  });
});