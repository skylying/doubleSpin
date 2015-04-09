var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect');

// Start webserver
gulp.task('webserver', function() {
	connect.server({
		livereload: true
	});
});	

// Minify js
gulp.task('minify', function() {
  gulp.src('src/dd.js')
    .pipe(uglify())
    .pipe(rename({
    	extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
});

// reload
gulp.task('reload', function() {
	gulp.src('index.html')
		.pipe(connect.reload());	
})

gulp.task('watch', function() {
	gulp.watch('src/**/*.*', ['minify']);
	gulp.watch('index.html', ['reload']);
});

gulp.task('default', ['webserver', 'watch']);