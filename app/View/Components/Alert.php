<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */


    /**
     * the message of alert
     * @var string
     */
    public $message;

    /**
     * the type message of alert
     * @var string
     */
    public $type;

    /**
     * this is just name for testing access
     *  @var string
     */
    public $name = 'Mehdi';
     
    /**
     * Create the component instance
     * @param string $type
     * @param string $message 
     */
    public function __construct($message , $type)
    {
        $this->message = $message;
        $this->type    = $type;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.alert');
    }

    public function fullName(){
        return 'Mohammad Mahdi Kargar';
    }
}
