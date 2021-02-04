<div class="bg-white shadow-md rounded-md p-5">
    
    {{-- card title --}}
    @isset($title)   
        <div class="flex text-lg my-4">{{$title}}</div>
    @endisset

    {{-- content here --}}
    <div class="text-base">
        {{$slot}}
    </div>

</div>