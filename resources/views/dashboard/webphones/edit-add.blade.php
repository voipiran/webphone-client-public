<x-app-layout>

    {{-- header slot --}}
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            <a href="{{ route('webphones.index') }}">{{ __('Webphones') }}</a> / {{ __('Create') }}
        </h2>
    </x-slot>

    {{-- javascript slot --}}
    <x-slot name="javascript">
        <script>
            let webphone = null;
        </script>
        @if(request()->routeIs('webphones.edit'))
            <script>
                webphone = {!! $webphone !!}
            </script>
        @endif
        <script src="{{ asset('js/webphones/edit-add.js') }}"></script>
    </x-slot>

    {{-- css slot --}}
    <x-slot name="css">
        <link rel="stylesheet" href="{{ asset('css/vue-multiselect.min.css') }}">
    </x-slot>

    {{-- content --}}
    <div class="container mx-auto px-4 py-4" id="webphones">
        <x-card>
            {{-- card title --}}
            <x-slot name="title">@lang('Create New Webphone')</x-slot>

            {{-- show errors if there is error --}}
            <x-auth-validation-errors class="mb-5"></x-auth-validation-errors>

            {{-- form content --}}
            <form action="{{ (request()->routeIs('webphones.edit')) ? route('webphones.update' , [$webphone->id]) : route('webphones.store') }}" method="POST">
                {{ csrf_field() }}

                @if(request()->routeIs('webphones.edit'))
                    @method('PUT')
                @endif

                <div class="-mx-3 md:flex mb-6">

                    {{-- Name Field --}}
                    <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-first-name">
                            @lang('Name')
                        </label>
                        <input name="name" class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3" id="grid-first-name" type="text"
                            placeholder="{{ __('Support') }}" value="{{ (request()->routeIs('webphones.edit')) ? $webphone->name : old('name') }}">
                        <p class="text-red text-xs italic">@lang('The name of webphone like Support')</p>
                    </div>

                    {{-- Caller Id Field --}}
                    <div class="md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
                            @lang('Caller Id')
                        </label>
                        <input name="callerId" class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4" id="grid-last-name" type="text"
                            placeholder="3008" value="{{ (request()->routeIs('webphones.edit')) ? $webphone->callerId : old('callerId') }}">
                    </div>

                    {{-- Status Field --}}
                    <div class="md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
                            @lang('Status')
                        </label>
                        <multiselect :allow-empty="false" :searchable="false" :show-labels="false" v-model="status" :options="statusOptions"></multiselect>
                        <input type="hidden" name="status" v-model="status">
                    </div>

                </div>

                <x-button class="bg-green-700 hover:bg-green-400">Submit</x-button>
            </form>

        </x-card>
    </div>

</x-app-layout>
