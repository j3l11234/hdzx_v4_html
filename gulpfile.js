var gulp = require('gulp');
var gulp_ = {
  autoprefixer: require('gulp-autoprefixer'),
  clean: require('gulp-clean'),
  sass: require('gulp-sass'),
  sequence: require('gulp-sequence'),
  sourcemaps: require('gulp-sourcemaps')
}

var webpack = require('webpack-stream');

//清除旧文件
gulp.task('clean', function(done) {
  return gulp.src('dist', {read: false})
    .pipe(gulp_.clean());
});

//复制资源文件
gulp.task('copy', function() {
  gulp.src([
    'src/**/*',
    '!src/{js,scss}/**/*'
  ])
    .pipe(gulp.dest('dist'));
});

//编译css
gulp.task('sass', function() {
  return gulp.src('src/scss/app.scss')
    .pipe(gulp_.sourcemaps.init())
    .pipe(gulp_.sass({
      includePaths: ['node_modules/bootstrap-sass/assets/stylesheets']
    })
      .on('error', gulp_.sass.logError))
    .pipe(gulp_.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp_.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('javascript', function(done) {
  return gulp.src('src/js/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'));
});


//构建项目
gulp.task('build', function(done) {
  gulp_.sequence('clean', ['copy', 'sass', 'javascript'], done);
});

gulp.task('default', ['build']);