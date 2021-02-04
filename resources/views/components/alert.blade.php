<div {{$attributes->merge(['class' => 'mt-3-'.$type])}}>
    <div class="title">{{$title}}</div>
    <br>
    <div class="body">{{$body}}</div>
    <div class="alert alert-{{$type}}">{{ $message }}</div>
    {{$slot}}
</div>