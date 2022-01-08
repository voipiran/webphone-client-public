<?php

/**
 * check licence verified or not
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class LicenceVerified
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
        $response = Http::post('http://'.config('app.WssServer').'/voipiran/unity-licence/licences/check-licence', [
            'app' => 'webphone',
            'licence' => config('app.licence'),
        ]);

        if ($response->successful()) {
            return $next($request);
        } else {
            abort(522);
        }
    }
}
