var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var prefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var refresh = require('gulp-livereload');
var lrserver = require('tiny-lr')();
var express = require('express');
var livereload = require('connect-livereload');

var livereloadport = 35729;
var serverport = 4000;

//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./public'));

 
gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);
});
 

gulp.task('less', function() {
  gulp
    .src('./public/less/base.less')
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message));
        gutil.beep();
        this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer('last 4 versions', 'ie 8'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
    .pipe(refresh(lrserver));
});

gulp.task('less:watch', function(){
    gulp.watch(['./public/less/*.less', './public/less/**/*.less']);
});

var tsProject = ts.createProject({
  sourceMap: true,
  declaration: true,
  noImplicitAny: true,
  module: "commonjs",
});

gulp.task('tsc', function() {
  return gulp.src('src/*.ts')
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red(error.message));
      gutil.beep();
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts', ['tsc'], function() {
  return gulp.src('build/js/main.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(browserify({
      debug: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
    .pipe(refresh(lrserver));
});

gulp.task('scripts:watch', ['scripts'], function() {
  gulp.watch('src/*.ts', ['scripts']);
});

gulp.task('watch', ['scripts:watch', 'less:watch', 'scripts', 'less', 'serve']);

gulp.task('default', ['scripts', 'less']);
