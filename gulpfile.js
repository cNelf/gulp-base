const del = require('del');
// const path = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

// config
const src = 'src';
const dist = 'dist'

// options
const srcOptions = { base: src };
// const watchOptions = { events: ['add', 'change'] };

// 文件匹配路径
const globs = {
  js: `${src}/**/*.js`, // 匹配 js 文件
  json: `${src}/**/*.json`, // 匹配 json 文件
  css: `${src}/**/*.css`, // 匹配 css 文件
  less: `${src}/**/*.less`, // 匹配 less 文件
  image: `${src}/**/*.{jpg,jpeg,png,gif,svg}` // 匹配 image 文件
}

// 匹配需要被拷贝的文件
globs.copy = [`${src}/**`,
  `!${globs.js}`, `!${globs.json}`, `!${globs.css}`,
  `!${globs.less}`, `!${globs.image}`
]

// 包装 gulp.lastRun, 引入文件 ctime 作为文件变动判断另一标准
// https://github.com/gulpjs/vinyl-fs/issues/226
const since = task => {
  file => (gulp.lastRun(task) > file.stat.ctime ? gulp.lastRun(task) : 0)
};

/**
 * `gulp clear`
 * 清理文件
 */
const clear = () => del('dist');

/**
 * `gulp copy`
 * 拷贝
 */
const copy = () => gulp.src(
  globs.copy,
  { ...srcOptions, since: since(copy) }
)
  .pipe(changed(dist)) // 过滤掉未改变的文件
  .pipe(gulp.dest(dist));

/**
 * `gulp js`
 * 解析js
 */
const js = () => gulp.src(
  globs.js,
  { ...srcOptions, since: since(js) }
)
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest(dist));

/**
 * `gulp css`
 * 解析css
 */
const css = () => gulp.src(
  globs.css,
  { ...srcOptions, since: since(css) }
)
  .pipe(autoprefixer('last 2 versions'))
  .pipe(cssmin())
  .pipe(gulp.dest(dist));

// 通用构建
const _build = gulp.parallel(
  copy,
  js,
  css
);

/**
 * `gulp build`
 * 构建
 */
const build = gulp.series(
  clear,
  _build
)

module.exports = {
  clear,
  copy,
  js,
  css,
  build
}
