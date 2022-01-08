[33mcommit 847027969a9b710af3d1bb0e5bc16a61824bd432[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m)[m
Author: hassan Abedini <abedini.hassan.dc@gmail.com>
Date:   Thu Dec 30 17:09:20 2021 +0330

    start client licence

[1mdiff --git a/app/Http/Kernel.php b/app/Http/Kernel.php[m
[1mindex 30020a5..9998eba 100644[m
[1m--- a/app/Http/Kernel.php[m
[1m+++ b/app/Http/Kernel.php[m
[36m@@ -21,6 +21,8 @@[m [mclass Kernel extends HttpKernel[m
         \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,[m
         \App\Http\Middleware\TrimStrings::class,[m
         \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,[m
[32m+[m[32m        \App\Http\Middleware\CheckLicence::class[m
[32m+[m
     ];[m
 [m
     /**[m
[1mdiff --git a/app/Http/Middleware/CheckLicence.php b/app/Http/Middleware/CheckLicence.php[m
[1mnew file mode 100644[m
[1mindex 0000000..6f67d9a[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Middleware/CheckLicence.php[m
[36m@@ -0,0 +1,31 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Middleware;[m
[32m+[m
[32m+[m[32muse Closure;[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Illuminate\Support\Facades\Http;[m
[32m+[m
[32m+[m
[32m+[m[32mclass CheckLicence[m
[32m+[m[32m{[m
[32m+[m[32m    /**[m
[32m+[m[32m     * Handle an incoming request.[m
[32m+[m[32m     *[m
[32m+[m[32m     * @param  \Illuminate\Http\Request  $request[m
[32m+[m[32m     * @param  \Closure  $next[m
[32m+[m[32m     * @return mixed[m
[32m+[m[32m     */[m
[32m+[m[32m    public function handle(Request $request, Closure $next)[m
[32m+[m[32m    {[m
[32m+[m[32m        $response = Http::post('https://192.168.1.61/voipiran/unity-licence/checkLicenceClient', [[m
[32m+[m[32m            'name' => 'Steve',[m
[32m+[m[32m            'licenceID' => '220',[m
[32m+[m[32m        ]);[m
[32m+[m[32m        if ($response) {[m
[32m+[m[32m            return $next($request);[m
[32m+[m[32m        } else {[m
[32m+[m[32m            return "Error";[m
[32m+[m[32m        }[m
[32m+[m[32m    }[m
[32m+[m[32m}[m
[1mdiff --git a/routes/web.php b/routes/web.php[m
[1mindex 0f1c74b..8e778bb 100644[m
[1m--- a/routes/web.php[m
[1m+++ b/routes/web.php[m
[36m@@ -10,12 +10,12 @@[m [muse Illuminate\Support\Facades\Route;[m
 |--------------------------------------------------------------------------[m
 */[m
 [m
[31m-Route::get('/', [FrontController::class , 'index']);[m
[32m+[m[32mRoute::get('/', [FrontController::class, 'index'])->middleware('CheckLicence');[m
 [m
 /** ---------------------- Start Dashboard Routes ------------------------- */[m
[31m-require __DIR__.'/dashboard.php';[m
[32m+[m[32mrequire __DIR__ . '/dashboard.php';[m
 /** ---------------------- Start Dashboard Routes ------------------------- */[m
 [m
 /** ---------------------- Start Login Routes ------------------------- */[m
[31m-require __DIR__.'/auth.php';[m
[31m-/** ---------------------- End Login Routes ------------------------- */[m
\ No newline at end of file[m
[32m+[m[32mrequire __DIR__ . '/auth.php';[m
[32m+[m[32m/** ---------------------- End Login Routes ------------------------- */[m
