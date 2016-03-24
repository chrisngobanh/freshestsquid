/* eslint no-console:0 */

import axios from 'axios';
import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import nodemon from 'gulp-nodemon';
import rename from 'gulp-rename';
import s3 from 'gulp-s3';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';

// This is the list of vendors that we package separately
const vendors = ['axios', 'director', 'jquery', 'lodash', 'react', 'react-helmet'];

/**
 * The process that this task undergoes:
 * 1. Recursively finds all of the .js and .jsx files being included,
 *    starting at client/js/index.js
 * 2. Transpiles them from ES6 JS and React JSX to ES5 JS using Babel
 * 3. Bundles them all up into a single file named 'scripts.min.js'
 * 4. If the server is in production, it minifies the file
 * 5. Puts 'scripts.min.js' in the public/ directory
 */
gulp.task('compile-js',
  () => browserify({
    entries: 'client/js/index.js',
    extensions: ['.jsx'],
  })
    .external(vendors) // Do not package any vendors
    .transform(babelify)
    .bundle()
    .pipe(source('scripts.min.js'))
    .pipe(buffer())
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('public'))
);

/**
 * The purpose of this task is to package big libraries, such as React, separately
 * so that when we develop, we don't need to keep repacking it when it's not changing.
 *
 * When developing, this task should only be called when "gulp server" is initially ran.
 * .js and .jsx file changes do not call this task.
 *
 * The process this task goes through is similar to compile-js, except it will find
 * all of the packages specified in the "vendors" array and run the process on them
 */
gulp.task('compile-vendor',
  () => {
    const b = browserify();

    // Loop through the vendors array and require each listed package
    vendors.forEach(lib => {
      b.require(lib);
    });

    return b
    .transform(babelify)
    .bundle()
    .pipe(source('vendors.min.js'))
    .pipe(buffer())
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('public'));
  }
);

/**
 * The process that this task undergoes:
 * 1. Recursively finds all of the .scss files being included,
 *    starting at 'client/sass/index.scss'
 * 2. Processes them into minified .css files
 * 3. Bundles them into a single file named 'styles.min.css'
 * 4. Puts 'styles.min.css' in the public/ directory
 */
gulp.task('compile-sass',
  () => gulp.src('client/sass/index.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('public'))
);

/**
 * The process that this task undergoes:
 * 1. Finds all of the files in server/ and its subdirectories, and
 *    all of the .js and .jsx files in shared/ and its subdirectories
 * 2. Transpile them from ES6 JS to ES5 JS using Babel
 * 3. Places them in the app/ directory
 */
gulp.task('compile-server',
  () => gulp.src(['server/**', 'shared/**/*.js', 'shared/**/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest('app'))
);

// Runs the compile-js, compile-sass, and compile-server tasks
gulp.task('compile', ['compile-sass', 'compile-js', 'compile-vendor', 'compile-server']);

gulp.task('server', ['compile'], () => {
  browserSync.create().init({
    files: ['shared/views/*.html', 'public/**'],
    port: 8001,
    proxy: 'http://localhost:8000',
    ui: { port: 8002 },
    open: false,
  });

  gulp.watch('client/sass/**/*.scss', ['compile-sass']);
  gulp.watch(['client/js/*.js', 'shared/**/*', '!shared/**/*.html'], ['compile-js']);

  return nodemon({
    script: 'app',
    env: { 'NODE_ENV': 'development' },
    ext: 'js jsx',
    tasks: ['compile-server'],
    watch: ['server/**/*', 'shared/**/*'],
  });
});

// Run ESLint on the code to see if it follows Airbnb's style guide
gulp.task('lint',
  () => gulp.src(['**/*.js', '**/*.jsx',
                  '!node_modules/**', '!public/**', '!app/**'])
    .pipe(eslint())
    .pipe(eslint.format())
);

// 'gulp test' is just an alias of 'gulp lint'
gulp.task('test', ['lint']);

function upload(files) {
  return () => {
    const awsCredentials = require('./aws.json');
    const cfCredentials = require('./cloudflare.json');
    const headers = {
      'X-Auth-Email': cfCredentials.email,
      'X-Auth-Key': cfCredentials.key,
    };

    const data = { 'purge_everything': true };
    axios
      .delete(`https://api.cloudflare.com/client/v4/zones/${cfCredentials.zid}/purge_cache`,
        { data, headers }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log('Cloudflare cache successfully purged.');
        }
      });
    gulp.src(files)
      .pipe(s3(awsCredentials, {
        uploadPath: '/',
        headers: { 'x-amz-acl': 'public-read' },
      }));
  };
}

// Upload scripts.min.js and styles.min.css to the CDN
gulp.task('upload', ['compile-sass', 'compile-js'],
          upload(['public/scripts.min.js', 'public/styles.min.css']));

// Upload all assets to the CDN
gulp.task('hard-upload', ['compile-sass', 'compile-js'], upload('public/**'));
