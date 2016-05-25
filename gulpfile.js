// includes
var os = require('os');
var gulp = require('gulp');
var open = require('gulp-open');

// Opens fleet overview test files
gulp.task('test-fo', function() {
  gulp.src('./tests/fleet_overview/*')
  .pipe(open({app: 'chrome'}));
});

// Default gulp
gulp.task('default', ['cless'], function() {
  // watch for LESS changes
  gulp.watch(paths.less, ['cless']);
});
