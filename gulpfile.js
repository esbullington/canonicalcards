var gulp = require('gulp');
var fs = require('fs');
var browserify = require('gulp-browserify');
var greact = require('gulp-react');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var prefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var refresh = require('gulp-livereload');
var lrserver = require('tiny-lr')();
var express = require('express');
var parse = require('csv-parse');
var livereload = require('connect-livereload');
var karma = require('karma').server;

var livereloadport = 35729;
var serverport = 4000;

var server = express();

//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
 
//We only configure the server here and start it only when running the watch task
server.use(express.static(__dirname + '/public'));

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);
});
 
gulp.task('less', function() {
  gulp
    .src('./src/less/base.less')
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

gulp.task('less:build', function() {
  gulp
    .src('./src/less/base.less')
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message));
        gutil.beep();
        this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer('last 4 versions', 'ie 8'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('less:watch', ['less'], function(){
    gulp.watch('./src/less/**/*.less', ['less'])
});

gulp.task('jsx', function() {
  return gulp.src('src/**/*.js')
             .pipe(greact({harmony: true}))
             .pipe(gulp.dest('build'));
});

gulp.task('scripts', ['jsx'], function() {
  return gulp.src('build/main.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(sourcemaps.write())
    .pipe(refresh(lrserver));
});

gulp.task('scripts:build', ['jsx'], function() {
  return gulp.src('build/main.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(sourcemaps.write())
});


gulp.task('html:watch', function() {
  gulp.watch('public/index.html', function() {
    return gulp.src('public/index.html')
      .pipe(refresh(lrserver));
  });
});

gulp.task('scripts:watch', ['scripts'], function() {
  gulp.watch('src/**/*.js', ['scripts']);
});


gulp.task('watch', ['scripts:watch', 'less:watch', 'html:watch', 'serve']);

gulp.task('default', ['scripts:build', 'less:build']);
