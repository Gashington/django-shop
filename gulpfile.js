var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    connect = require ('gulp-connect'),
    spritesmith  = require('gulp.spritesmith'),
    minifyCSS = require('gulp-minify-css'),
    htmlreplace = require('gulp-html-replace'),
    rename = require("gulp-rename"),
    watch = require('gulp-watch'),
    jsArr = [
        '/js/vendor/jquery-1.11.1.js',
        '/js/vendor/jquery-migrate-1.2.1.min.js',
        '/js/app/vendor/angular.js',
        '/js/app/contollers/PhoneListCtrl.js',
        '/js/vendor/TweenMax.js',
        '/js/vendor/fancybox.js',
        'js/vendor/bootstrap.js',
        'js/vendor/bootstrap-hover-dropdown.min.js',
        'js/vendor/jquery.magnific-popup.min.js',
        'js/vendor/custom.js',
        '/js/plugins.js',
        '/js/main.js',
    ],
    cssArr = [
        '/css/vendor/bootstrap.css',
        '/font/css/font-awesome.css',
        '/css/vendor/style.css',
        '/css/vendor/responsive.css',
        '/css/normalize.css',
        '/css/main.css',
        '/css/widgets.css',
    ]





// Задачи выполняемые при старте.
gulp.task('default', function () {
    gulp.start([
        'htmlconfig',
        'dev-server',
        'stylus',
        'sprite',
        'watch'
    ]);
});

// конфигурация html
gulp.task('htmlconfig', function() {
    gulp.src('./dev/index.html')
        .pipe(htmlreplace({
            'cssConfig': cssArr,
            'jsConfig': jsArr
        },{keepBlockTags: true}))
        .pipe(rename({
            basename: "index",
        }))
        .pipe(gulp.dest('./dev'));
});
// запуск сервера
gulp.task('dev-server', function(){
    connect.server({
        root: ['./dev'],
        port: 3000,
        keepalive: true,
        livereload: true
    })
});

// Включаем наблюдателей в рабочей директории
gulp.task('watch', function () {
    //gulp.watch(['./dev/img/sprite/*.*'], ['sprite'])
    watch(['./dev/**/*.*','!./dev/stylus/**/*.*'], function (files, cb) {
        gulp.start('reload', cb);
        console.error('done reload')
    });
    watch(['./dev/stylus/**/*.styl'], function (files, cb) {
        gulp.start('stylus', cb);
        console.error('done')
    });
    watch(['./dev/img/sprite/*.*'], function (files, cb) {
        gulp.start('sprite', cb);
        console.error('done-sprite')
    });
    //gulp.watch(['./dev/**/*.*','!./dev/stylus/**/*.*'], ['reload']); // наблюдение за файлами всеми файлами исключая *.styl
    //gulp.watch(['./dev/stylus/**/*.styl'], ['stylus']); // наблюдение за файлами  *.styl
    //gulp.watch(['./dev/img/sprite/*.*'], ['sprite'])
});

    // перезагрузка страницы при изменении и добавлении файлов в dev директории
    gulp.task('reload', function () {
        gulp.src('./dev/**/*.*')
            .pipe(connect.reload());
    });


    // компиляция stylus
    gulp.task('stylus', function () {
        gulp.src(['./dev/stylus/*.styl', '!dev/stylus/mixin/*.styl'])
            .pipe(stylus())
            .pipe(gulp.dest('./dev/css'))
    });

    // Создание спрайта
    gulp.task('sprite', function() {
        var spriteData =
            gulp.src('./dev/img/sprite/*.*') // путь, откуда берем картинки для спрайта
                .pipe(spritesmith({
                    imgName: 'sprite.png',
                    cssName: 'sprite.styl',
                    cssFormat: 'stylus',
                    algorithm: 'binary-tree',
                    cssTemplate: './dev/stylus/stylus.template.mustache',
                    cssVarMap: function(sprite) {
                        sprite.name = 's-' + sprite.name
                    }
                }));

        spriteData.img.pipe(gulp.dest('./dev/img/')); // путь, куда сохраняем спрайт
        spriteData.css.pipe(gulp.dest('./dev/stylus/mixin/')); // путь, куда сохраняем стили
    });

// Задача по сборке проекта в папку ./app.
gulp.task('build', function () {
    gulp.start([
        'build-html',
        'build-css',
        'build-js',
        'img-min',
        //'copy-source',
    ]);
});

    gulp.task('build-html', function() {
        gulp.src('./dev/index.html')
            .pipe(htmlreplace({
                'cssConfig': 'build.min.css',
                'jsConfig': 'build.min.js'
            }))
            .pipe(rename({
                basename: "index",
            }))
            .pipe(gulp.dest('./app'));
    });

    // сборка js
    gulp.task('build-js', function() {
        gulp.src(jsArr)
            .pipe(concat('build.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('app/js'));
    });

    // сборка css
    gulp.task('build-css', function() {
        gulp.src(cssArr)
            .pipe(concat('build.min.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest('app/css'));
    });

    // оптимизация изображений
    gulp.task('img-min', function () {
        gulp.src('./dev/img/**/*.{png,jpg,gif}')
            .pipe(imagemin())
            .pipe(gulp.dest('./app/img'))
    });

    // копирование *.html в папку проекта
    //gulp.task('copy-source', function () {
    //    gulp.src(['./dev/**/*.*','!./dev/img/**/*.*'], { base: './dev' })
    //        .pipe(gulp.dest('./app'))
    //});




