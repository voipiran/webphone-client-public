const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').postCss('resources/css/app.css', 'public/css', [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
]);

mix.js('resources/js/webphones/edit-add.js' , 'public/js/webphones').vue()
mix.js('resources/js/webphones/browse.js' , 'public/js/webphones').vue()
mix.js('resources/js/index.js' , 'public/js').vue()
mix.js('resources/js/new-phone.js' , 'public/js')
mix.js('resources/js/new-index.js' , 'public/js')
