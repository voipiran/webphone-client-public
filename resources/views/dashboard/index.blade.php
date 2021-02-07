<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <span class="mb-5">@lang('Webphone Settings:')</span>
                    <hr  class="mb-3">                    
                    CID NAME = {{env('CID_NAME')}} <br>
                    SIP URI = {{env('SIP_URI')}} <br>
                    AUTH USER = {{env('AUTH_USER')}} <br>
                    PASSWORD = {{env('PASSWORD')}} <br>
                    WS SERVER = {{env('WS_SERVER')}} <br>
                    
                    <x-alert type="success">
                        You can change this settings in .env file in root.
                    </x-alert>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
