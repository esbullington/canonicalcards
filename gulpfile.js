var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject({
  removeComments: true,
  noImplicitAny: true,
  declarationFiles: true,
  module: "commonjs",
  noExternalResolve: false
});

gulp.task('scripts', function() {
  var tsResult = gulp.src('src/main.ts')
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));
  return tsResult
    .pipe(browserify({
      debug : true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));

});

gulp.task('watch', ['scripts'], function() {
  gulp.watch('src/*.ts', ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts']);
