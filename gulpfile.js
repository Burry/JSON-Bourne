require('dotenv').config()
const browserSync = require('browser-sync')
const gulp = require('gulp')
const server = require('gulp-develop-server')
const jsHint = require('gulp-jshint')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')
const autoPrefixer = require('gulp-autoprefixer')

let options = {
    'browserSync': {
        proxy: 'http://localhost:' + process.env.PORT
    },
    'server': {
        path: './bin/www'
    },
    'sass': {
        errLogToConsole: true,
        outputStyle: 'compressed'
    }
}

let files = {
    'js': './**/*.js',
    'server': [
        './bin/www',
        './routes/**/*.js',
        './views/**/*.pug',
        './*.js'
    ],
    'sass': './sass/**/*.scss',
    'css': './public/css'
}

gulp.task('server:start', () => {
    return server.listen(options.server, err => {
        if (!err) browserSync(options.browserSync)
        else console.error(err)
    })
})

gulp.task('server:restart', () => {
    return server.restart(err => {
        if (!err) browserSync.reload()
        else console.error(err)
    })
})

gulp.task('lint', () => {
    return gulp
        .src(files.js)
        .pipe(jsHint())
})

gulp.task('style', () => {
    return gulp
        .src(files.sass)
        .pipe(sourceMaps.init())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(files.css))
})

gulp.task('build', ['lint', 'style'])

gulp.task('default', ['lint', 'style', 'server:start'], () => {
    gulp.watch(files.js, ['lint'])
        .on('change', () => {
            console.log('JS files changed — linting...')
        })
    gulp.watch(files.server, ['server:restart'])
        .on('change', () => {
            console.log('Server files changed — restarting application...')
        })
    gulp.watch(files.sass, ['style'])
        .on('change', () => {
            console.log('Stylesheet changed — compiling...')
        })
})
