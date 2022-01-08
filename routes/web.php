<?php

use App\Http\Controllers\FrontController;
use App\Models\Webphone;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes Register Here
|--------------------------------------------------------------------------
*/

Route::get('/', [FrontController::class, 'index'])->middleware('licenceVerified');

/** ---------------------- Start Dashboard Routes ------------------------- */
require __DIR__ . '/dashboard.php';
/** ---------------------- Start Dashboard Routes ------------------------- */

/** ---------------------- Start Login Routes ------------------------- */
require __DIR__ . '/auth.php';
/** ---------------------- End Login Routes ------------------------- */
