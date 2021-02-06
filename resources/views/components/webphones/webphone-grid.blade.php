<div>
    <!-- there is not webphone -->
    @if (!count($webphones))
        <x-alert type="warning">
            @lang('No Webphones defined yet')
        </x-alert>
    @endif

    <!-- there is webphone -->
    @if (count($webphones))
        <table class="border-collapse w-full">
            <thead>
                <tr>
                    <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Name</th>
                    <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Caller Id</th>
                    <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Status</th>
                    <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($webphones as $webphone)
                    <tr class="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                            <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
                            {{ $webphone->name }}
                        </td>
                        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                            <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Caller Id</span>
                            {{ $webphone->callerId }}
                        </td>
                        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                            <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Status</span>
                            <span class="rounded text-white bg-{{ $webphone->status == 'active' ? 'green' : 'red' }}-500 py-1 px-3 text-xs font-bold">{{ $webphone->status }}</span>
                        </td>
                        <td class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                            <span class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Actions</span>
                            <a href="{{ route('webphones.edit', [$webphone->id]) }}" class="text-blue-400 hover:text-blue-600 underline">Edit</a>
                            <a href="#" v-on:click="remove({{ $webphone->id }})" class="text-blue-400 hover:text-blue-600 underline pl-6">Remove</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
