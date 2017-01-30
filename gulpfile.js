//http://www.codeofclimber.ru/2015/use-gulp-to-automate-building-of-jekyll-based-site/
var gulp = require('gulp');

var paths = {
    source: './src',
    css: './src/styles',
    images: './src/images',
    scripts: './src/js',
    pub: './_site'
};

// build tasks
var childProcess = require('child_process');
gulp.task('jekyll', function(cb) {
    var child = childProcess.exec('jekyll build', function(error, stdout, stderr) {
        cb(error);
    });
});

// var htmlmin = require('gulp-htmlmin');
// gulp.task('htmlmin', function() {
//     return gulp.src('./_site/**/*.html')
//         .pipe(htmlmin({
//             collapseWhitespace: true,
//             removeComments: true,
//             conservativeCollapse: true,
//             collapseBooleanAttributes: true,
//             removeRedundantAttributes: true,
//             removeEmptyAttributes: true,
//             removeEmptyElements: true,
//             lint: false,
//             minifyJS: true,
//             minifyCSS: true,
//         }))
//         .pipe(gulp.dest('./_site/'));
// });

// less or sass
gulp.task('less', function() {
    return gulp.src(paths.asset + '/less/**/*')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less().on('error', console.error.bind(console)))
        .pipe($.autoprefixer(autoprefixerBrowsers))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(paths.pub + '/css'))
        .pipe($.size({ title: 'less' }));
});

var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('build-css', function() {
    return gulp.src('./_site/css/*.css')
        .pipe(minifycss())
        .pipe(autoprefixer({
            browsers: ['> 1%'],
            cascade: false,
        }))
        .pipe(gulp.dest('./_site/css'));
});

var jsValidate = require('gulp-jsvalidate');
var uglify = require('gulp-uglify');
gulp.task('build-js', function() {
    return gulp.src('./_site/js/**/*.js')
        .pipe(jsValidate())
        .pipe(uglify())
        .pipe(gulp.dest('./_site/js/'));
});


gulp.task('build', ['jekyll'], function() {
    gulp.watch('build-css');
    // gulp.run('htmlmin');

});

// check tasks
var bootlint = require('gulp-bootlint');
var html5Lint = require('gulp-html5-lint');
var htmlhint = require("gulp-htmlhint");
gulp.task('check-html', function() {
    return gulp.src('./_site/**/*.html')
        .pipe(html5Lint())
        .pipe(htmlhint())
        .pipe(bootlint());
});


gulp.task('check', ['check-html', 'check-scss'], function() {});

// default task
gulp.task('default', ['build'], function() {});
