const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const merge = require('merge-stream');
const bs = require('browser-sync').create();
const reload = bs.reload;
const nodemon = require('gulp-nodemon');

gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        if (!started) {
            cb();
        }
        started = true;
    });
});

gulp.task('browser-sync', ['nodemon'], function () {
    bs.init({
        proxy: "http://localhost:3000",
        files: ["views/**/*.*"],
        port: 8000,
    });
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(['views/**/*.html'], reload);
    gulp.watch(['views/assets/js/**/*.js'], reload);
    gulp.watch(['views/assets/css/**/*.css'], reload);
});

gulp.task('scripts', () => {
    return gulp.src(['views/assets/js/**/*.js', '!views/assets/js/plugins'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ compress: true, mangle: false }).on('error', (e) => {
            console.log(e);
        }))
        .pipe(gulp.dest('views/assets/build/js'));
});

gulp.task('styles', () => {
    return gulp.src('views/assets/css/**/*.css')
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('views/assets/build/css'));
});

//Default Task
gulp.task('default', ['scripts', 'styles', 'watch']);
