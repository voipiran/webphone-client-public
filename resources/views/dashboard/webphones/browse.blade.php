<x-app-layout>

    {{-- header navigation --}}
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Webphones') }}
        </h2>
    </x-slot>

    {{-- content --}}
    <div class="container mx-auto px-4 py-4" id="webphones">

        {{-- create new webphone button --}}
        <form action="{{ route('webphones.create') }}" method="GET">
            <x-button class="bg-green-700 hover:bg-green-400 mb-3 flex justify-end">Create</x-button>
        </form>

        {{-- show all webphones --}}
        <x-card>
            {{-- card title  --}}
            <x-slot name="title">
                Your Webphones
            </x-slot>

            {{-- content => webphones Grid  --}}
            <x-webphone-grid></x-webphone-grid>
            
        </x-card>

        <x-slot name="javascript">
            <script src="{{asset('js/webphones/browse.js')}}"></script>
        </x-slot>

    </div>
</x-app-layout>
