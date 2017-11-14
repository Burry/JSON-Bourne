'use strict';

require('dotenv').config();
const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const esLint = require('gulp-eslint');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const models = require('./models');

// Paths
let paths = {
    modules: {
        src: './node_modules/**/*.*',
        dest: './node_modules/'
    },
    build: {
        files: './client/build/**/*.*',
        dest: './client/build/'
    },
    vendor: {
        dest: './client/build/vendor/'
    },
    js: {
        src: './client/scripts/**/*.js',
        dest: './client/build/js/'
    },
    images: {
        src: './client/images/**/*.*',
        dest: './client/build/images/'
    },
    styles: {
        src: './client/styles/*.scss',
        dest: './client/build/css/'
    },
    serverJs: ['./**/*.js', '!./node_modules/**/*.*', '!./client/**/*.*']
}

// Options
let options = {
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
    },
    importer: {
        recipeCount: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 10 : 1000
    }
}

// Disconnect from MongoDB
// (otherwise it keeps its connection open indefinitely)
gulp.task('disconnect-mongo-from-gulp', next => models.mongo.close(next));

// Clean
gulp.task('clean', next => require('del')(paths.build.dest, next));

// Scrape and import recipes and ingredients
gulp.task('recipe-ingredient-importer', next => models.mongo.populate(next));
gulp.task('pop-mongo', gulp.series('recipe-ingredient-importer', 'disconnect-mongo-from-gulp'));

// Delete databases
gulp.task('drop-mongo', next => models.mongo.drop(next));
gulp.task('drop-sql', next => models.sql.drop(next));
gulp.task('dropdb', gulp.parallel('drop-mongo', 'drop-sql'), next => next());

// Lint server JS files
gulp.task('es-lint-server', next => {
    return gulp
        .src(paths.serverJs)
        .pipe(esLint())
        .pipe(esLint.format())
        .on('end', next);
});

// Lint build JS files
gulp.task('es-lint-build', next => {
    return gulp
        .src(paths.js.src)
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream())
        .on('end', next);
});

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
        .on('end', next);
});

// Copy image directory
gulp.task('images', next => {
    return gulp
        .src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
        .on('end', next);
});

// Copy vendor dependencies
function copyVendorDependency(dependency, subDependency, next) {
    return gulp
        .src(paths.modules.dest + `${dependency}/${subDependency}/**/*.*`)
        .pipe(gulp.dest(paths.vendor.dest + `${dependency}/`))
        .on('end', next);
}

function copyFAFonts(next) {
    return gulp
        .src(paths.modules.dest + 'font-awesome/fonts/*.*')
        .pipe(gulp.dest(paths.build.dest + 'fonts/'))
        .on('end', next);
}

gulp.task('jquery', next => {
    return copyVendorDependency('jquery', 'dist', next);
})

gulp.task('popper.js', next => {
    return copyVendorDependency('popper.js', 'dist/umd', next);
})

gulp.task('bootstrap', next => {
    return copyVendorDependency('bootstrap', '', next);
})

gulp.task('fontawesome', next => {
    return copyVendorDependency('font-awesome', '', () => copyFAFonts(next));
})

gulp.task('algolia', next => {
    return copyVendorDependency('instantsearch.js', 'dist', next);
})

gulp.task('vendor', gulp.parallel('jquery', 'popper.js', 'bootstrap', 'fontawesome', 'algolia', 'disconnect-mongo-from-gulp'), next => next());

// Build application
gulp.task('build', gulp.parallel('es-lint-server', 'es-lint-build', 'styles', 'images', 'disconnect-mongo-from-gulp'), next => next());

// Start/restart nodemon
gulp.task('nodemon', next => {
    let running = false;
    let stream = nodemon(options.nodemon)
        .on('start', () => {
            if (!running) next();
            running = true;
        })
        .on('restart', () => {
            setTimeout(() => {
                browserSync.reload({stream: false});
                next();
            }, 1500);
        })
        .on('crash', function() {
            console.error('The application has crashed! Restarting in 10s...');
            stream.emit('restart', 10);
        });
    return stream;
})

// Start BrowserSync
gulp.task('browser-sync', next => {
    browserSync.init(options.browserSync);
    next();
})

// Watch for and handle changes
gulp.task('watch', next => {
    gulp.watch(paths.serverJs, gulp.series('es-lint-server'));
    gulp.watch(paths.js.src, gulp.series('es-lint-build'));
    gulp.watch(paths.styles.src, gulp.series('styles'));
    next();
})

// Default task
gulp.task('default', gulp.series('build', 'nodemon', 'browser-sync', 'watch'));
