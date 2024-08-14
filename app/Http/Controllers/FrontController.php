<?php

namespace App\Http\Controllers;

use App\Models\Webphone;
use Illuminate\Http\Request;

class FrontController extends Controller
{
    public function index()
    {
        return view('index', [
            'webphones' => Webphone::active()->get()
        ]);
    }
}
