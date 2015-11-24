var gulp = require('gulp');
var minify = require('gulp-minify');
var gutil = require('gulp-util');
gulp.task('compress', function() {
  gulp.src('./script.js')
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist')).on('error', gutil.log)
});