<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes Register Here
|--------------------------------------------------------------------------
*/

Route::get('component' , function(){
    return view('test');
});

Route::get('/', function () {
    return view('welcome');
});

/** ---------------------- Start Dashboard Routes ------------------------- */
require __DIR__.'/dashboard.php';
/** ---------------------- Start Dashboard Routes ------------------------- */

/** ---------------------- Start Login Routes ------------------------- */
require __DIR__.'/auth.php';
/** ---------------------- End Login Routes ------------------------- */
