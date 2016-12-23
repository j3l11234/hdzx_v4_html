var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var argv = require('optimist').argv;

var DIST = './dist';

gulp.task('clean', function () {
  return del([
    './dist/**/*',
  ]);
});

gulp.task('dev', function() {
  if (argv.dist) {
    DIST = argv.dist;
    console.log('the DIST files wiil be saved in: '+ DIST);
  }
  gulp.start('style', 'images', 'bootstrap', 'webpack-watch', 'watch');
});

gulp.task('build', ['clean'], function() {
    gulp.start('style', 'images', 'webpack', 'bootstrap');
});

gulp.task('style', function() {
  let stream = gulp.src('./src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
  
  if (process.env.NODE_ENV !== 'production') {
    stream.pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST + '/css'));
  } else {
    stream.pipe(gulp.dest(DIST + '/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST + '/css'));
  }
});

gulp.task('images', function() {
  gulp.src('./src/images/**/*')
    .pipe(gulp.dest(DIST + '/images/'));
});

gulp.task('bootstrap', function() {
  //style
  let stream = gulp.src('./src/scss/bootstrap.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']
    }).on('error', sass.logError))
    
  if (process.env.NODE_ENV !== 'production') {
    stream.pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST + '/bootstrap/css'));
    
  } else {
    stream.pipe(gulp.dest(DIST + '/bootstrap/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST + '/bootstrap/css'));
  }
  
  //fonts
  gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest(DIST + '/bootstrap/fonts/bootstrap'))

  gulp.src('./node_modules/bootstrap-sass/assets/javascripts/+(bootstrap.js|bootstrap.min.js)')
    .pipe(gulp.dest(DIST + '/bootstrap/js'))
});


gulp.task('webpack-watch', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(require('./webpack.config.js'),{watch:true}),require('webpack')))
    .pipe(gulp.dest(DIST + '/js'));
});


gulp.task('webpack', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config.js'),require('webpack')))
    .pipe(gulp.dest(DIST + '/js'));
});


gulp.task('watch', function() {
  gulp.watch('./src/scss/app.scss', ['style']);
  gulp.watch('./src/scss/bootstrap.scss', ['bootstrap']);
});

