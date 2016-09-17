var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var argv = require('optimist').argv;

var DIST = argv.dist ? argv.dist : './dist';
console.log('the DIST files wiil be saved in: '+DIST);

gulp.task('dev', function() {
    gulp.start('styles', 'webpack-watch', 'watch');
});

gulp.task('build', function() {
    gulp.start('styles', 'webpack');
});

gulp.task('styles', function() {
  gulp.src('./src/scss/app.scss')
    .pipe(sass({
      sourceMap: true,
      includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
    }).on('error', sass.logError))
    .pipe(gulp.dest(DIST + '/css'));

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
  gulp.watch('./src/scss/app.scss', ['styles']);
});

