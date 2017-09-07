'use strict';

var gulp 		  = require('gulp');
var sass 		  = require('gulp-sass');
var sourcemaps 	  = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var concat 		  = require('gulp-concat');
var babel         = require('gulp-babel');
var minify   	  = require('gulp-minify');
var sequence      = require('run-sequence');
var bulkSass      = require('gulp-sass-bulk-import');
var jsPaths  	  = [
    './public/javascripts/libs/base/*.js',
    './public/javascripts/libs/*.js',
    './public/javascripts/app/*.js',
    './public/javascripts/nodes/common/*.js',
    './public/javascripts/nodes/modules/*.js'
];

// Compile all sass files
gulp.task('sass', function() {
    return gulp.src('./public/sass/style.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass(
            {outputStyle: 'compressed'}
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/stylesheets/'));
});


// Watch js/sass files and re-compile on save
gulp.task('app:watch', function(done) {
    sequence(['sass:watch', 'js:watch'], done);
});


// Watch sass files and re-compile on save
gulp.task('sass:watch', function() {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
});


// Watch js files and re-concatenate on save
gulp.task('js:watch', function() {
    gulp.watch(jsPaths, ['js:concat']);
});


// Concatenate all js files
gulp.task('js:concat', function() {
    return gulp.src(jsPaths)
        .pipe(sourcemaps.init())
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(concat('main.js', {
            newLine:'\n;'
        }))
        .pipe(gulp.dest('./public/javascripts/'));
});


// Minify js file
gulp.task('js:minify', function() {
    gulp.src('./public/javascripts/main.js')
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('./public/javascripts/'));
});