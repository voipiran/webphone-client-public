<x-app-layout>

    {{-- header navigation --}}
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            <a href="{{ route('webphones.index') }}">{{ __('Webphones') }}</a> / {{ __('Create') }}
        </h2>
    </x-slot>

    {{-- content --}}
    <div class="container mx-auto px-4 py-4">
        <x-card>
            {{-- title --}}
            <x-slot name="title">@lang('Create New Webphone')</x-slot>

            {{-- show errors if there is error  --}}
            <x-auth-validation-errors class="mb-5"></x-auth-validation-errors>

            {{-- form content --}}
            <form action="{{ route('webphones.store') }}" method="POST">
                {{ csrf_field() }}
                <!-- webphone name -->
                <div class="-mx-3 md:flex mb-6">
                    <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-first-name">
                            @lang('Name')
                        </label>
                        <input name="name" class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3" id="grid-first-name" type="text" placeholder="{{ __('Support') }}" value="{{old('name')}}">
                        <p class="text-red text-xs italic">@lang('The name of webphone like Support')</p>
                    </div>
                    <div class="md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
                            @lang('Caller Id')
                        </label>
                        <input name="callerId" class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4" id="grid-last-name" type="text" placeholder="3008" value="{{old('callerId')}}">
                    </div>
                </div>

                <x-button class="bg-green-700 hover:bg-green-400">Submit</x-button>
            </form>

        </x-card>
    </div>

</x-app-layout>
