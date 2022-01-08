<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;

/**test commands */
Artisan::command('dev', function () {
    $response = Http::post('http://'.config('app.WssServer').'/voipiran/unity-licence/licences/check-licence', [
        'app' => 'webphone',
        'licence' => 'VOIPIRAN_v024T8otR6E5fB30fSP1GROoIB0jC79ct3cxXX65y690y2EfK3q4Q1JG324D013925BoJnrV2qp0M17yPILP7mdA964G6396NjdZ98LJjuRbdf1VrentdAk89b23Hcgp5oTY97454vq6gqw292L1E768OCi0sjzOjx3vs4SsD2qo9OTQk3lp1mJyzACYg9B',
    ]);
    $this->comment( $response->status );
})->purpose('Display an inspiring quote');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
