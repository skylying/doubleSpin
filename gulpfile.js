var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
 
gulp.task('compress', function() {
  gulp.src('src/dd.js')
    .pipe(uglify())
    .pipe(rename({
    	extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'))
});