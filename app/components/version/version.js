'use strict';

angular.module('ROAnalyzer.version', [
  'ROAnalyzer.version.interpolate-filter',
  'ROAnalyzer.version.version-directive'
])

.value('version', '0.1');
