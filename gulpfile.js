var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var argv = require('optimist').argv;

var DIST = argv.dist ? argv.dist : './dist';
console.log('the DIST files wiil be saved in: '+DIST);

gulp.task('dev', function() {
    gulp.start('style', 'webpack-watch', 'watch');
});

gulp.task('build', function() {
    gulp.start('style', 'webpack');
});

gulp.task('style', function() {
  if (process.env.NODE_ENV !== 'production'){
    gulp.src('./src/scss/app.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']
      }).on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(DIST + '/css'))
  } else {
     gulp.src('./src/scss/app.scss')
      .pipe(sass({
        includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']
      }).on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(gulp.dest(DIST + '/css'))
  }
  
});

gulp.task('webpack-watch', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(require('./webpack.config.js'),{watch:true})))
    .pipe(gulp.dest(DIST + '/js'));
});

gulp.task('webpack', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(DIST + '/js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/scss/app.scss', ['style']);
});

