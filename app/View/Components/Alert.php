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
     * the type message of alert
     * @var string
     */
    public $type;

    /**
     * the color of alert
     */
    public $color;
    
    /**
     * Create the component instance
     * @param string $type
     */
    public function __construct($type)
    {
        $this->type    = $type;
        switch ($type) {
            case 'success':
                $this->color = 'green';
                break;
            case 'warning':
                $this->color = 'yellow';
                break;
            case 'danger':
                $this->color = 'red';
                break;
        }
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
}
