<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class CheckLicence
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = Http::post('https://192.168.1.61/voipiran/unity-licence/checkLicenceClient', [
            'name' => 'Steve',
            'licenceID' => '220',
        ]);
        if ($response) {
            return $next($request);
        } else {
            return "Error";
        }
    }
}
