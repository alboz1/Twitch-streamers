const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-webserver');
const babel = require('gulp-babel');

function handleError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('server', () => {
    gulp.src('./')
        .pipe(server({
            livereload: true,
            open: true,
            port: 8080,
        }));
});

gulp.task('babel', () => {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .on('error', handleError)
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
  return gulp.src('src/sass/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
              browsers: ['last 2 versions']
          }))
          .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/js/*.js', ['babel']);
    gulp.watch('src/sass/*.sass', ['sass']);
});

gulp.task('default', ['server', 'sass', 'babel', 'watch']);