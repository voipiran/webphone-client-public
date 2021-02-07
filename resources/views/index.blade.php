<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>single page</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="css/default.css">
    <link rel="stylesheet" href="{{asset('css/animate.min.css')}}">
</head>

<body>

    <!-- viciphone stuff just for not error  -->
    <div id="container" style="display: none;">
        <!-- Main -->
        <div id="main">
            <!-- Video element to handle audio -->
            <audio autoplay width='0' height='0' id="audio"></audio>

            <!-- Logo -->
            <section id="logo">
                <img id="logo_img" src="images/voipiran_logo.png">
            </section>
            <!-- End Logo -->

            <!-- ----------- VOIPIRAN - Start Registered User ------- -->
            <section id="reg_name">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 172 172" style=" fill:#000000;">
                    <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                        font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                        <path d="M0,172v-172h172v172z" fill="none"></path>
                        <g fill="#ffffff">
                            <path
                                d="M89.01,11.7175c-12.65812,0.22844 -21.90312,4.00438 -27.52,11.395c-6.65156,8.76125 -7.86094,22.10469 -3.655,39.56c-1.54531,1.89469 -2.71437,4.77031 -2.2575,8.6c0.90031,7.55188 3.92375,10.68281 6.3425,11.9325c1.16906,5.96625 4.46125,12.64469 7.6325,15.8025v1.6125c0.01344,2.27094 -0.02687,4.42094 -0.1075,6.665c1.80063,3.7625 7.51156,9.675 19.995,9.675c12.5775,0 18.43625,-6.03344 20.1025,-10.2125c-0.06719,-2.06937 -0.01344,-4.03125 0,-6.1275v-1.6125c3.07719,-3.14437 6.24844,-9.83625 7.4175,-15.8025c2.48594,-1.23625 5.42875,-4.35375 6.3425,-11.9325c0.45688,-3.74906 -0.645,-6.59781 -2.15,-8.4925c2.00219,-6.81281 6.08719,-24.55031 -0.9675,-35.905c-2.95625,-4.75687 -7.43094,-7.75344 -13.33,-8.9225c-3.25187,-4.09844 -9.48687,-6.235 -17.845,-6.235zM112.66,114.7025c-4.34031,5.01219 -12.01312,9.1375 -23.22,9.1375c-11.40844,0 -18.86625,-4.1925 -23.1125,-9.03c-3.27875,2.75469 -8.51937,4.82406 -14.2975,7.095c-13.4375,5.28094 -30.14031,11.81156 -31.39,32.68l-0.215,3.655h138.03l-0.215,-3.655c-1.24969,-20.86844 -17.88531,-27.39906 -31.2825,-32.68c-5.805,-2.29781 -11.03219,-4.4075 -14.2975,-7.2025z">
                            </path>
                        </g>
                    </g>
                </svg>
                
            </section>
            <!-- ----------- VOIPIRAN - End Registered User ------- -->

            <!-- ----------- VOIPIRAN - Start hangout Button ------- -->
            <section id="hangoutButton">
                <img src="images/decline.png">
            </section>
            <!-- ----------- VOIPIRAN - End Hangout Button ------- -->

            <!-- Controls -->
            <section id="controls">
                <section id="registration_control">
                    <input type="text" value="" id="reg_status" readonly>
                    <button class="button" id="register"><img id="reg_icon" src="images/wp_register_inactive.gif" alt="register"></button>
                    <button class="button" id="unregister"><img id="unreg_icon" src="images/wp_unregister_inactive.gif" alt="register"></button>
                </section>
                <section id="dial_control">
                    <input type="text" name="digits" value="" id="digits" />
                    <button class="button" id="dial"><img id="dial_icon" src="images/wp_dial.gif" alt="register"></button>
                </section>
                <section id="audio_control">
                    <button class="button" id="mic_mute"><img id="mute_icon" src="images/wp_mic_on.gif" alt="mute"></button>
                    <button class="button" id="vol_up"><img id="vol_up_icon" src="images/wp_speaker_up.gif" alt="register"></button>
                    <button class="button" id="vol_down"><img id="vol_down_icon" src="images/wp_speaker_down.gif" alt="register"></button>
                </section>
            </section>
            <!-- End Controls -->

            <!-- Dialpad -->
            <section id="dialpad">
                <section id="dial_row1">
                    <button class="dialpad_button" id="one">1</button>
                    <button class="dialpad_button" id="two">2</button>
                    <button class="dialpad_button" id="three">3</button>
                </section>
                <section id="dial_row2">
                    <button class="dialpad_button" id="four">4</button>
                    <button class="dialpad_button" id="five">5</button>
                    <button class="dialpad_button" id="six">6</button>
                </section>
                <section id="dial_row3">
                    <button class="dialpad_button" id="seven">7</button>
                    <button class="dialpad_button" id="eight">8</button>
                    <button class="dialpad_button" id="nine">9</button>
                </section>
                <section id="dial_row4">
                    <button class="dialpad_button" id="star">*</button>
                    <button class="dialpad_button" id="zero">0</button>
                    <button class="dialpad_button" id="pound">#</button>
                </section>
                <section id="dial_dtmf">
                    <input type="text" name="dtmf_digits" value="" id="dtmf_digits" />
                    <button class="button" id="send_dtmf">Send</button>
                </section>
            </section>
            <!-- End Dialpad -->

        </div>
        <!-- End Main -->
    </div>

    <div class="container-fluid h-full" id="index">
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
            <div class="bottom">
                <div class="row">
                    <span class="arrow-down"></span>
                </div>
                
                {{-- call buttons here  --}}
                <div class="grid grid-cols-1 md:grid-cols-{{ (count($webphones) > 3 ) ? 3 : count($webphones) }} gap-4 justify-center mx-auto max-w-md">
                    @foreach ($webphones as $webphone)
                    <div class="row btn-container">
                        <button class="btn-call" id="btn_call" v-on:click="doSome">
                            <span>{{$webphone->name}}</span>
                        </button>
                    </div>
                    @endforeach
                </div>

                {{-- status navigation here --}}
                <div class="animate__animated animate__fadeOutUp flex justify-center mx-auto max-w-md mr-auto bg-gray-600 text-white p-5 rounded-md mt-4">
                    Calling to Administrator...
                </div>
                
                <div class="row">
                    <small id="speaking"></small>
                </div>
            </div>
        </div>
    </div>

    <!-- Debug Output -->
    <pre id="debug"></pre>

    <!-- variables to pass vici_phone.js -->
    <script>
        //------- VOIPIRAN Support Caller id ------
        var voipiran_sid = 3007;

        // SIP configuration variables
        var cid_name  = {{ env('CID_NAME') }};
        var sip_uri   = "{{ env('SIP_URI') }}";
        var auth_user = "{{ env('AUTH_USER') }}";
        var password  = "{{ env('PASSWORD') }}";
        var ws_server = "{{ env('WS_SERVER') }}";

        // whether debug should be enabled
        var debug_enabled = null ;

        // display restriction options
        var hide_dialpad = null ;
        var hide_dialbox = null ;
        var hide_mute    = null ;
        var hide_volume  = null ;

        // behavior options
        var auto_answer   = null ;
        var auto_dial_out = null ;
        var auto_login    = null ;

        // language support
        var language = "en";
    </script>


    <script src="js/sweetalert2@9.js"></script>
    <script>
        // -------- VOIPIRAN Start Define Toast from Sweetalert --------
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        // -------- VOIPIRAN End Define Toast from Sweetalert --------
    </script>


    <!-- WebRTC adapter -->
    <!-- <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script> -->

    <!-- Voipiran Offline Version  -->
    <script src="js/adapter.js"></script>


    <!-- SIP.js library, included from CDN. If you need it offline, uncomment the next line -->
    <script src="js/sip-0.15.11.min.js"></script>

    <!-- SIP.js library offline version -->
    <!-- script src="js/sip-0.15.11.min.js"></script -->

    <!-- Translations file -->
    <script src="js/translations.js"></script>

    <script src="js/webphone.js"></script>
</body>

</html>
