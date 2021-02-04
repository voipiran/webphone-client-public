<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\WebphoneController;

Route::group(['prefix' => 'dashboard' , 'middleware' => ['auth']], function () {
    Route::get('/' , [HomeController::class , 'index'] )->name('dashboard');    
    Route::resources([
        'webphones' => WebphoneController::class 
    ]);
});