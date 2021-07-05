<?php

namespace App\View\Components;

use App\Models\Webphone;
use Illuminate\View\Component;

class WebphoneGrid extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        $webphones = Webphone::latest()->paginate(10);
        return view('components.webphones.webphone-grid' , [
            'webphones' => $webphones
        ]);
    }
}
