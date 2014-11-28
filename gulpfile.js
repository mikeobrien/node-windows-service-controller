var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('default', ['test']);

gulp.task('test', ['lint'], function() {
    gulp.src('test/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**/*'])
        .pipe(jshint({ node: true }))
        .pipe(jshint.reporter('default'));
});