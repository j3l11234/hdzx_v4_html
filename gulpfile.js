var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');


gulp.task('dev', function() {
    gulp.start('styles', 'webpack', 'watch');
});

gulp.task('styles', function() {
  gulp.src('./src/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/assets/css/'));

});

gulp.task('webpack', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(require('./webpack.config.js'),{watch:true})))
    .pipe(gulp.dest('D:/xampp/htdocs/hdzx_v4/frontend/web/js'));

  gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(require('./webpack.config.backend.js'),{watch:true})))
    .pipe(gulp.dest('D:/xampp/htdocs/hdzx_v4/backend/web/js'));
});


gulp.task('watch', function() {
  gulp.watch('./src/scss/app.scss', ['styles']);
});

