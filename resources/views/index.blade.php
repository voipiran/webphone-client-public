<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voipiran Webphone</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="css/default.css">
    <link rel="stylesheet" href="{{ asset('css/animate.min.css') }}">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="HandheldFriendly" content="true">

    <meta name="format-detection" content="telephone=no" />
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
    <meta name="apple-mobile-web-app-capabale" content="yes" />

    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Expires" content="0" />

    <link rel="icon" href="favicon.ico">

    <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/Normalize/normalize-v8.0.1.css" />
    <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/fonts/font_roboto/roboto.css" />
    <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/fonts/font_awesome/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-ui.min.css" />
    <link rel="stylesheet" type="text/css" href="https://dtd6jl0d42sve.cloudfront.net/lib/Croppie/Croppie-2.6.4/croppie.css" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/phone.css') }}" />

    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery.md5-min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Chart/Chart.bundle-2.7.2.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/SipJS/sip-0.11.6.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/FabricJS/fabric-2.4.6.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Moment/moment-with-locales-2.24.0.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/Croppie/Croppie-2.6.4/croppie.min.js"></script>
    <script type="text/javascript" src="https://dtd6jl0d42sve.cloudfront.net/lib/XMPP/strophe-1.4.1.umd.min.js"></script>

    <script type="text/javascript">
        var web_hook_on_transportError = function(t, ua) {
            // console.warn("web_hook_on_transportError",t, ua);
        }
        var web_hook_on_register = function(ua) {
            // console.warn("web_hook_on_register", ua);
        }
        var web_hook_on_registrationFailed = function(e) {
            // console.warn("web_hook_on_registrationFailed", e);
        }
        var web_hook_on_unregistered = function() {
            // console.warn("web_hook_on_unregistered");
        }
        var web_hook_on_invite = function(session) {
            // console.warn("web_hook_on_invite", session);
        }
        var web_hook_on_message = function(message) {
            // console.warn("web_hook_on_message", message);
        }
        var web_hook_on_modify = function(action, session) {
            // console.warn("web_hook_on_modify", action, session);
        }
        var web_hook_on_dtmf = function(item, session) {
            // console.warn("web_hook_on_dtmf", item, session);
        }
        var web_hook_on_terminate = function(session) {
            // console.warn("web_hook_on_terminate", session);
        }
    </script>

    {{-- some path used in js file --}}
    <script>
        let wssServerConf = "{{ config('app.WssServer') }}"
        let WebSocketPortConf = "{{ config('app.WebSocketPort') }}"
        let SipUsernameConf = "{{ config('app.SipUsername') }}"
        let SipPasswordConf = "{{ config('app.SipPassword') }}"
    </script>
</head>

<body>
    <div id="Phone" style="display: none;"></div>

    <div class="container-fluid h-screen" id="index" v-cloak>
        <div class="top-container">
            <div class="top">
                <div class="row">
                    <a href="https://voipiran.io" target="_blank"><img src="images/voipiran_logo.png" class="logo"></a>
                </div>
                <div class="row">
                    <img src="images/avatar.png" class="avatar">
                </div>
            </div>
        </div>
        <div class="bottom-container">
            <div class="bottom" v-if="isReRegister === true">
                <div class="row">
                    <span class="arrow-down"></span>
                </div>
                {{-- call buttons here --}}
                <div class="grid grid-cols-1 md:grid-cols-{{ count($webphones) > 3 ? 3 : count($webphones) }} gap-4 justify-center mx-auto max-w-md">

                    {{-- no webphones exists --}}
                    @if (!count($webphones))
                        <x-alert type="default">
                            No Webphones Defined Yet!
                        </x-alert>
                    @endif

                    @foreach ($webphones as $webphone)
                        <div class="row btn-container">
                            <button class="btn-call" :disabled="status.showAnimate" v-on:click="dial('{{ $webphone->callerId }}' , '{{ $webphone->name }}')">
                                <span class="font-yekan">{{ $webphone->name }}</span>
                            </button>
                        </div>
                    @endforeach
                </div>

                {{-- status navigation here --}}

                <div v-if="status.show" class="flex mx-auto max-w-md mr-auto bg-gray-600 text-white p-5 rounded-md mt-4" :class="{ 'animate__animated animate__backInLeft' : status.showAnimate , 'animate__animated animate__backOutLeft' : !status.showAnimate  }">
                    <span class="flex">
                        {{-- description like calling to administrator... --}}
                        <span class="mr-2" v-html="status.description"></span>
                        <span class="mr-2" v-html="status.spekingTime"></span>
                        {{-- loader --}}
                        <beat-loader :loading="status.spinnerLoading" :color="status.spinnerColor" :size="status.spinnerSize"></beat-loader>
                    </span>
                    <button v-on:click="endCall" class="bg-red-600 rounded-md p-3 absolute inset-y-0 right-0 hover:bg-red-500">End Call</button>
                </div>

                {{-- <div class="row">
                    <small id="speaking"></small>
                </div> --}}
            </div>

            {{-- loading --}}
            <div class="bottom" v-if="isReRegister == 'loading'">
                <beat-loader :loading="status.spinnerLoading" :color="status.spinnerColor" :size="status.spinnerSize"></beat-loader>
            </div>

            {{-- registration failed --}}
            <div class="bottom" v-if="isReRegister === false">
                Registration Failed Please Contact Administrator
            </div>
        </div>
    </div>

    <script type="text/javascript" src="{{ asset('js/new-index.js') }}"></script>
</body>

</html>
