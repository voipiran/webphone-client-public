<?php
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'dashboard' , 'middleware' => ['auth']], function () {
    Route::get('/' , [HomeController::class , 'index'] )->name('dashboard');    
    Route::resource('webphones', 'WephoneController');
});