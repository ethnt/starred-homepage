var paths = {
  source  : './src',
  styles  : './src/styles',
  js : './src/js',
  dist: './public',
};

var siteRoot = '_site';
var srcFiles = 'src/**/*.*';

var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps'); 

var child = require('child_process');
var browserSync = require('browser-sync').create(); // live css reload & browser syncing

var autoprefixer = require('gulp-autoprefixer'); // add vendor prefixes to CSS
var browserify = require('browserify'); // allows usage of require in the browser
var cssnano = require('gulp-cssnano'); // css minifier
var uglify = require('gulp-uglify'); // js minifier
var size = require('gulp-size'); // logs out the total size of files in the stream and optionally the individual file-sizes.
var gutil = require('gulp-util'); // utility functions for gulp plugins
var plumber = require('gulp-plumber'); // prevent pipe breaking caused by errors from gulp plugins
var del = require('del'); // delete stuff

var buffer = require('vinyl-buffer'); 
var source = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');

// @todo image optimization
// @todo linters

var autoprefixerBrowsers = [
  'ie >= 8',
  'ie_mob >= 8',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('bundleIndexJS',['clean'], browserifyBundleIndexTask);
gulp.task('bundleComponentJS',['clean'], browserifyBundleComponentsTask);

gulp.task('js',[
  'bundleVendorJS',
  'bundleIndexJS',
  'bundleComponentJS'
]);

// Purge the output folder
gulp.task('clean', () => {
  return gulp.src([paths.dist], {read: false})
         .pipe(vinylPaths(del));
});


function browserifyBundleIndexTask() {
  return browserifyBundleTask('bundle', [
    paths.js + '/index.js'
  ]);
}

function browserifyBundleComponentsTask() {
  return browserifyBundleTask('components', [
    paths.js + '/components.js'
  ]);
}

function browserifyBundleTask(bundleName, entries) {

  var bundler = browserify({
    entries: entries,
    debug: false
  });

  return bundler
       .external(require(paths.js + '/vendor.js'))
       .bundle()
       .pipe(plumber())
       .pipe(source(bundleName + '.js'))
       .pipe(buffer())
       .pipe(sourcemaps.init({loadMaps: true}))
       .pipe(uglify({
        dead_code: true,
        drop_debugger: true,
        drop_console: true,
       }))
       .pipe(sourcemaps.write('./'))
       .pipe(gulp.dest(paths.dist))
       .pipe(size({ title: bundleName + ' size' }));
};

// Parse the LESS files and create minified CSS output
gulp.task('less',['clean'],() => {
  
  gulp.src([
      paths.styles + '/fonts/**/*',
      paths.styles + '/external/**/*.css',
      paths.styles + '/fonts_homepage.css',
    ],{ base: paths.styles })
    .pipe(gulp.dest(paths.dist + '/css/'));

  gulp.src(paths.styles + '/homepage.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less().on('error', console.error.bind(console)))
    .pipe(autoprefixer(autoprefixerBrowsers))
    .pipe(cssnano({
          safe: true,
          discardUnused: false,
          discardEmpty: false,
          discardDuplicates: false,
          autoprefixer: false
     }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist + '/css/'))
    .pipe(size({ title: 'less' }));
});

gulp.task('bundleVendorJS',['clean'], () => {

  var bundler = browserify({
    paths: ['./src'],
    debug: false
  });

  return bundler
         .require(require(paths.js + '/vendor.js'))
         .bundle()
         .pipe(plumber())
         .pipe(source('vendor.js'))
         .pipe(buffer())
         .pipe(uglify({
          dead_code: true,
          drop_debugger: true,
          drop_console: true
         }))
         .pipe(gulp.dest(paths.dist))
         .pipe(size({ title: 'vendor Size' }));
});

// run jekyll serve --watch --incremental --drafts and log the output buffer
gulp.task('jekyll', () => {
  var jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  var jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// live reloading
gulp.task('serve', ['jekyll'], () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

});

gulp.task('default', ['less','js'],function(){
    gulp.start('serve',function(){
       // gulp.watch(srcFiles, ['less','js']);
    });
});