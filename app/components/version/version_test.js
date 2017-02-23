'use strict';

describe('ROAnalyzer.version module', function() {
  beforeEach(module('ROAnalyzer.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
