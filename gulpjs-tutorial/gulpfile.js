const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

// Copy all html files from src to dist:
gulp.task('copyHtml', function () {
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist'));
});

// Optimize images:
gulp.task('imageMin', function () {
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images')); // Destination folder is created if it doesn't exist
});

// Minify JS:
gulp.task('minify', function () {
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js')); // Destination folder is created if it doesn't exist
});

// Compile SASS to CSS:
gulp.task('sass', function() {
	gulp.src('src/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/css'));
});

// Concatenate Files (Scripts):
gulp.task('concat', function() {
	gulp.src('src/js/*.js')
		.pipe(concat('main.js')) // Give the concatenated file a name
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// Watch SASS and JS files:
gulp.task('watch', function() {
	gulp.watch('src/sass/*.scss', ['sass']);
	gulp.watch('src/js/*.js', ['concat']);
});

// Runs all the specified tasks by default
gulp.task('default', ['copyHtml', 'imageMin', 'sass', 'concat']);