'use strict'

require('dotenv').config()
const autoPrefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const del = require('del')
const esLint = require('gulp-eslint')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

// Paths
let paths = {
    modules: {
        src: './node_modules/**/*.*',
        dest: './node_modules/'
    },
    build: {
        files: './build/**/*.*',
        dest: './build/',
        vendor: {
            src: './client/build/vendor/**/*.*',
            dest: './client/build/vendor/'
        },
        js: {
            src: './client/scripts/**/*.js',
            dest: './client/build/js/'
        },
        images: {
            src: './client/images/**/*.*',
            dest: './client/build/images/'
        }
    },
    styles: {
        src: './client/styles/*.scss',
        dest: './client/build/css/'
    },
    serverJS: ['./**/*.js', '!./node_modules/**/*.*', '!./client/**/*.*']
}

// Options
let options = {
    bower: {
        directory: paths.build.vendor.dest
    },
    browserSync: {
        files: '/client/build/*',
        proxy: 'http://localhost:' + (parseInt(process.env.PORT) || 3000),
        port: (parseInt(process.env.PORT) + 1 || 3001),
        ui: {
            port: (parseInt(process.env.PORT) + 2 || 3002)
        },
        notify: true
    },
    nodemon: {
        script: './bin/www',
        ext: 'js json pug',
        ignore: ['gulpfile.js', paths.build.dest, paths.styles.src, paths.modules.dest],
        quiet: true
    }
}

// Clean
gulp.task('clean', () => {
    return del(paths.build.dest)
})

// Lint server JS files
gulp.task('es-lint-server', next => {
    return gulp
        .src(paths.serverJS)
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failAfterError())
        .on('end', next)
})

// Lint build JS files
gulp.task('es-lint-build', next => {
    return gulp
        .src(paths.build.js.src)
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failAfterError())
        .pipe(sourceMaps.init())
        .pipe(uglify())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(paths.build.js.dest))
        .pipe(browserSync.stream())
        .on('end', next)
})

// Compile SASS and run Autoprefixer
gulp.task('styles', next => {
    return gulp
        .src(paths.styles.src)
        .pipe(sourceMaps.init())
        .pipe(sass({errLogToConsole: true}).on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(cleanCSS())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
        .on('end', next)
})

// Copy image directory
gulp.task('images', next => {
    return gulp
        .src(paths.build.images.src)
        .pipe(gulp.dest(paths.build.images.dest))
        .on('end', next)
})

// Build application
gulp.task('build', gulp.parallel('es-lint-server', 'es-lint-build', 'styles', 'images'), next => next())

// Start/restart nodemon
gulp.task('nodemon', next => {
    let running = false
    let stream = nodemon(options.nodemon)
        .on('start', () => {
            if (!running) next()
            running = true
        })
        .on('restart', () => {
            setTimeout(() => {
                browserSync.reload({stream: false})
                next()
            }, 1500)
        })
        .on('crash', function() {
            console.error('The application has crashed! Restarting in 10s...')
            stream.emit('restart', 10)
        })
    return stream
})

// Start BrowserSync
gulp.task('browser-sync', next => {
    browserSync.init(options.browserSync)
    next()
})

// Watch for and handle changes
gulp.task('watch', next => {
    gulp.watch(paths.serverJS, gulp.series('es-lint-server'))
    gulp.watch(paths.build.js.src, gulp.series('es-lint-build'))
    gulp.watch(paths.styles.src, gulp.series('styles'))
    next()
})

// Default task
gulp.task('default', gulp.series('build', 'nodemon', 'browser-sync', 'watch'))
