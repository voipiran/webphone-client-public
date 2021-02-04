<x-app-layout>

    {{-- header navigation --}}
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Webphones') }}
        </h2>
    </x-slot>

    {{-- content --}}
    <div class="container mx-auto px-4 py-4">

        {{-- create new webphone button --}}
        <form action="{{ route('webphones.create') }}" method="GET">
            <x-button class="bg-green-700 hover:bg-green-400 mb-3 flex justify-end">Create</x-button>
        </form>

        {{-- show all webphones --}}
        <x-card>
            <x-slot name="title">
                Card Title
            </x-slot>
            card content here
        </x-card>

    </div>
</x-app-layout>
