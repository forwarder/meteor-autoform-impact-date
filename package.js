Package.describe({
  name: 'forwarder:autoform-impact-date',
  version: '0.0.1',
  summary: 'Impact date picker field for AutoForm',
  git: 'https://github.com/forwarder/meteor-autoform-impact-date',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'templating',
    'underscore',
    'reactive-var',
    'aldeed:autoform'
  ], 'client');

  api.addFiles([
    'lib/datepicker.html',
    'lib/datepicker.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('forwarder:autoform-impact-date');
  api.addFiles('tests/tests.js');
});
