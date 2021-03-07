import Vue from "vue";

/**sweet alert  */
import Swal from "sweetalert2";

/** spinner for loading stuff */
import BeatLoader from "vue-spinner/src/BeatLoader.vue";

/**the number will call  */
let voipiran_sid;

const vm = new Vue({
    el: "#index",
    data: {
        status: {
            show: false /** to not show the first animation we have to not show the div */,
            showAnimate: false,
            spinnerColor: "white",
            spinnerSize: "7px",
            description: null /** like 'calling to administrator...' */,
            spinnerLoading: true,
            spekingTime: null
        },
        name: null
    },
    methods: {
        dial(dialTo, name) {
            /**
             * we are handling of showing status with status.showAnimate
             * so we have to showStatus anyway
             */
            this.spinnerLoading = true;
            this.status.description = "Wait , we are making call with " + name;
            this.status.show = true;
            this.status.showAnimate = this.status.showAnimate ? false : true;

            this.name = name;
            voipiran_sid = dialTo;
            /**
             * make the call
             * the dialButton will make the call
             * */
            dialButton();
        },
        endCall() {
            this.status.description = "Ready to call";
            vm.$data.status.showAnimate = false;
            /**
             * before disconnect the call we have to detect the call status
             */
            switch (my_session.status) {

                /**
                 * before call made
                 * or
                 * phone is ringing other side
                 * */
                case 0:
                case 2:
                    endAudio.pause();
                    endAudio.currentTime = 0;
                    ringAudio.pause();
                    ringAudio.currentTime = 0;
                    my_session.cancel();
                    break;

                /**we are inCall  */
                case 12:
                    my_session.bye();
                    break;
            }
            my_session  = false;
            ringing = false;
            incall = false;
            // handleBye();
            this.status.showAnimate = false;
        }
    },
    components: {
        BeatLoader
    }
});

/** webpone codes here */
/* =================== VoipIran ===================== --> */
let voipIranRegiterButton = document.getElementById("register");
let voipIranUnRegiterButton = document.getElementById("unregister");
let voipIranRegStatus = document.getElementById("reg_status");
let voipIranDialCall = document.getElementById("dial");
let translated_message;
let options;
// let voipIranBtnToggle = parent.document.getElementById("btnToggle");
// let voipIranVici = parent.document.getElementById("vici");
/* =================== VoipIran ===================== --> */

var debug = debug_enabled;

// Array of the various UI elements
var uiElements = {
    container: document.getElementById("container"),
    main: document.getElementById("main"),
    audio: document.getElementById("audio"),
    logo: document.getElementById("logo"),
    controls: document.getElementById("controls"),
    registration_control: document.getElementById("registration_control"),
    reg_status: document.getElementById("reg_status"),
    register: document.getElementById("register"),
    unregister: document.getElementById("unregister"),
    dial_control: document.getElementById("dial_control"),
    digits: document.getElementById("digits"),
    dial: document.getElementById("dial"),
    audio_control: document.getElementById("audio_control"),
    mic_mute: document.getElementById("mic_mute"),
    vol_up: document.getElementById("vol_up"),
    vol_down: document.getElementById("vol_down"),
    dialpad: document.getElementById("dialpad"),
    one: document.getElementById("one"),
    two: document.getElementById("two"),
    three: document.getElementById("three"),
    four: document.getElementById("four"),
    five: document.getElementById("five"),
    six: document.getElementById("six"),
    seven: document.getElementById("seven"),
    eight: document.getElementById("eight"),
    nine: document.getElementById("nine"),
    star: document.getElementById("star"),
    zero: document.getElementById("zero"),
    pound: document.getElementById("pound"),
    dial_dtmf: document.getElementById("dial_dtmf"),
    dtmf_digits: document.getElementById("dtmf_digits"),
    send_dtmf: document.getElementById("send_dtmf"),
    debug: document.getElementById("debug"),
    reg_icon: document.getElementById("reg_icon"),
    unreg_icon: document.getElementById("unreg_icon"),
    dial_icon: document.getElementById("dial_icon"),
    hangup_icon: document.getElementById("hangup_icon"),
    mute_icon: document.getElementById("mute_icon"),
    vol_up_icon: document.getElementById("vol_up_icon"),
    vol_down_icon: document.getElementById("vol_down_icon"),
    // --- add hangoutButton VOIPIRAN  -------
    hangoutButton: document.getElementById("hangoutButton"),
    // --- add Single callButton VOIPIRAN  -------
    btn_call: document.getElementById("btn_call"),
    // --- Speaking Label VOIPIRAN  -------
    speaking: document.getElementById("speaking")
};

var ua;
var my_session = false;
var incall = false;
var ringing = false;
var muted = false;
var caller = "";
var mediaStream;
var mediaConstraints;

var ua_config = {
    userAgentString: "VOIPIRAN WEBPHONE",
    displayName: cid_name,
    uri: sip_uri,
    hackIpInContact: true,
    hackViaTcp: true,
    hackWssInTransport: true,
    authorizationUser: auth_user,
    password: password,
    log: {
        builtinEnabled: true,
        level: "debug"
    },
    transportOptions: {
        traceSip: true,
        wsServers: ws_server,
        userAgentString: "VOIPIRAN WEBPHONE"
    },
    autostart: true
};

// We define initial status
uiElements.reg_status.value = get_translation("unregistered");

debug_out(
    "<br />displayName: " +
        cid_name +
        "<br />uri: " +
        sip_uri +
        "<br />authorizationUser: " +
        auth_user +
        "<br />password: " +
        password +
        "<br />wsServers: " +
        ws_server
);

var sip_server = ua_config.uri.replace(/^.*@/, "");

// setup the ringing audio file
let ringAudio = new Audio("sounds/ringing.mp3");
let endAudio = new Audio("sounds/endRinging.mp3");
ringAudio.addEventListener(
    "ended",
    function() {
        this.currentTime = 0;
        this.play();
    },
    false
);

// setup the dtmf tone audio files
let dtmf0Audio = new Audio("sounds/0.wav");
let dtmf1Audio = new Audio("sounds/1.wav");
let dtmf2Audio = new Audio("sounds/2.wav");
let dtmf3Audio = new Audio("sounds/3.wav");
let dtmf4Audio = new Audio("sounds/4.wav");
let dtmf5Audio = new Audio("sounds/5.wav");
let dtmf6Audio = new Audio("sounds/6.wav");
let dtmf7Audio = new Audio("sounds/7.wav");
let dtmf8Audio = new Audio("sounds/8.wav");
let dtmf9Audio = new Audio("sounds/9.wav");
let dtmfHashAudio = new Audio("sounds/hash.wav");
let dtmfStarAudio = new Audio("sounds/star.wav");

// adjust the dtmf tone volume
dtmf0Audio.volume = dtmf1Audio.volume = dtmf2Audio.volume = dtmf3Audio.volume = dtmf4Audio.volume = dtmf5Audio.volume = dtmf6Audio.volume = dtmf7Audio.volume = dtmf8Audio.volume = dtmf9Audio.volume = dtmfHashAudio.volume = dtmfStarAudio.volume = 0.15;

processDisplaySettings();

initialize();

/************************************

  Beginning of functions

*************************************/

function debug_out(string) {
    // check if debug is enabled. If it isn't, end without doing anything
    if (!debug) return false;

    // format the date string
    var date;
    date = new Date();
    date =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);

    // add the debug string to the debug element
    uiElements.debug.innerHTML =
        uiElements.debug.innerHTML + date + " => " + string + "<br>";
}

function startBlink(type = "inComingCall") {
    if (type == "outGoingCall") {
        // voipIranDialCall.style.background = "#ff0000";
        // voipIranRegiterButton.classList.add("alertCallOutGoing");
        // voipIranRegStatus.classList.add("alertCallOutGoing");
        // voipIranBtnToggle.classList.add("alertCallOutGoing");
        // voipIranVici.classList.add("alertCallOutGoing");
        return;
    }
    notifyMe();

    // uiElements.reg_status.style.backgroundImage = "url('images/reg_status_blink.gif')";
    voipIranRegiterButton.classList.add("alertCall");
    voipIranRegStatus.classList.add("alertCall");
    // voipIranBtnToggle.classList.add("alertCall");
    // voipIranVici.classList.add("alertCall");
    voipIranDialCall.style.background = "green";
}

function stopBlink() {
    uiElements.reg_status.style.backgroundImage = "";
    voipIranRegiterButton.classList.remove("alertCall");
    voipIranRegStatus.classList.remove("alertCall");
    // voipIranBtnToggle.classList.remove("alertCall");
    // voipIranVici.classList.remove("alertCall");

    // if hangup  outgoingCall
    voipIranRegiterButton.classList.remove("alertCallOutGoing");
    voipIranRegStatus.classList.remove("alertCallOutGoing");
    // voipIranBtnToggle.classList.remove("alertCallOutGoing");
    // voipIranVici.classList.remove("alertCallOutGoing");
    // voipIranDialCall.style.background = '#434552';
}

function dialPadPressed(digit, my_session) {
    // only work if the dialpad is not hidden
    if (hide_dialpad) return false;

    switch (digit) {
        case "0":
            dtmf0Audio.play();
            break;
        case "1":
            dtmf1Audio.play();
            break;
        case "2":
            dtmf2Audio.play();
            break;
        case "3":
            dtmf3Audio.play();
            break;
        case "4":
            dtmf4Audio.play();
            break;
        case "5":
            dtmf5Audio.play();
            break;
        case "6":
            dtmf6Audio.play();
            break;
        case "7":
            dtmf7Audio.play();
            break;
        case "8":
            dtmf8Audio.play();
            break;
        case "9":
            dtmf9Audio.play();
            break;
        case "*":
            dtmfStarAudio.play();
            break;
        case "#":
            dtmfHashAudio.play();
            break;
    }

    // check if the my_session is not there
    if (my_session == false) {
        debug_out("Adding key press " + digit + " to dial digits");
        uiElements.digits.value = uiElements.digits.value + digit;
    } else {
        debug_out("Sending DTMF " + digit);
        my_session.dtmf(digit);
    }
}

function sendButton(my_session) {
    // only work if the dialpad is not hidden
    if (hide_dialpad) return false;

    // check if the my_session is not there
    if (my_session == false) {
        // TODO give some type of error
    } else {
        var digits = uiElements.dtmf_digits.value;
        debug_out("Sending DTMF " + digits);
        my_session.dtmf(digits);
        // ========= VOIPIRAN TRANSFER =====================
        my_session.refer(digits);
        // ========= VOIPIRAN TRANSFER =====================
        uiElements.dtmf_digits.value = "";
    }
}

function registerButton(ua) {
    debug_out("Register Button Pressed");
    ua.register();
}

function unregisterButton(ua) {
    debug_out("Un-Register Button Pressed");
    ua.unregister();
}

// VOIPIRAN HangoutButton Press
function voipiranHangupCall(state = null) {
    debug_out("Hangup Button Pressed");
    uiElements.dial_icon.src = "images/wp_dial.gif";
    voipIranDialCall.style.background = "green";
    uiElements.reg_status.value = get_translation("registered");
    uiElements.digits.value = "";
    setRinging(false);
    setCallButtonStatus(false);
    hangupCall();
    if (!state) {
        my_session.reject();
    }

    my_session = false;
    Toast.fire({
        text: "Call Disconnected!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    });
    return false;
}

function dialButton() {
    uiElements.digits.value = voipiran_sid;

    // check if in a call
    if (incall) {
        // we are so they hung up the call
        debug_out("Hangup Button Pressed");
        //=======  VOIPIRAN Start set background dial button green ==========
        uiElements.dial_icon.src = "images/wp_dial.gif";
        voipIranDialCall.style.background = "green";
        //=======  VOIPIRAN End set background dial button green ==========
        setCallButtonStatus(false);
        hangupCall();
        return false;
    }

    // we are not in a call
    setCallButtonStatus(true);

    // check if ringing
    if (ringing) {
        // we are ringing
        // stop the ringing
        // ==================== Voipiran =====================
        voipIranDialCall.style.background = "#ff0000";
        // ==================== Voipiran =====================

        setRinging(false);

        incall = true;
        debug_out("Answered Call");
        //=======  VOIPIRAN Start set background dial button red ==========
        voipIranDialCall.style.background = "#ff0000";
        //=======  VOIPIRAN End set background dial button red ==========

        var modifierArray = [SIP.Web.Modifiers.addMidLines];

        options = {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false
                },
                modifiers: [SIP.Web.Modifiers.addMidLines]
            }
        };

        my_session.accept(options, modifierArray);
    } else {
        // not in a call and the phone is not ringing
        debug_out("Dial Button Pressed");
        // made sure the dial box is not hidden
        if (!hide_dialbox) {
            // =============== VOIPIRAN  - Start Check filled number input =====================
            if (!uiElements.digits.value) {
                Toast.fire("", "Enter Phone Number...", "error");
                return;
            }
            // =============== VOIPIRAN  - END Check filled number input =====================
            uiElements.dial_icon.src = "images/wp_hangup.gif";
            //=======  VOIPIRAN Start set background dial button red ==========
            voipIranDialCall.style.background = "#ff0000";
            //=======  VOIPIRAN End set background dial button red ==========

            dialNumber();
        }
    }
}

function muteButton() {
    // only work if the button is not hidden
    if (hide_mute) return false;

    // check if in a call
    if (incall) {
        if (muted) {
            // call is currently muted
            // unmute it
            muted = false;
            debug_out("Un-Mute Button Pressed");
            uiElements.mute_icon.src = "images/wp_mic_on.gif";
        } else {
            // call is not muted
            // mute it
            muted = true;
            debug_out("Mute Button Pressed");
            uiElements.mute_icon.src = "images/wp_mic_off.gif";
        }

        // find all the tracks and toggle them.
        var pc = my_session.sessionDescriptionHandler.peerConnection;

        if (pc.getSenders) {
            pc.getSenders().forEach(function(sender) {
                if (sender.track) {
                    sender.track.enabled = !muted;
                }
            });
        } else {
            pc.getLocalStreams().forEach(function(stream) {
                stream.getAudioTracks().forEach(function(track) {
                    track.enabled = !muted;
                });
                stream.getVideoTracks().forEach(function(track) {
                    track.enabled = !muted;
                });
            });
        }
    } else {
        debug_out("Mute Button Pressed But Not In Call");
        uiElements.mute_icon.src = "images/wp_mic_on.gif";
        muted = false;
    }
}

function volumeUpButton() {
    // only work if the volume buttons are not hidden
    if (hide_volume) return false;
    setVolume(0.1);
    debug_out("Volume Up Button Pressed");
}

function volumeDownButton() {
    // only work if the volume buttons are not hidden
    if (hide_volume) return false;
    setVolume(-0.1);
    debug_out("Volume Down Button Pressed");
}

function setVolume(inc) {
    volume = uiElements.audio.volume;
    debug_out("Current Volume = " + Math.round(volume * 100) + "%");
    if (volume + inc < 0) {
        debug_out("Volume is already 0");
        return;
    } else if (volume + inc > 1) {
        debug_out("Volume is already maxed");
        return;
    } else volume = volume + inc;
    if (volume < 0) {
        volume = 0;
    }
    if (volume > 1) {
        volume = 1;
    }
    debug_out("New Volume = " + Math.round(volume * 100) + "%");
    uiElements.audio.volume = volume;
}

function hangupCall() {
    // check if in a call
    if (!incall) {
        // =========================== VoipIran ===============================
        // voipIranDialCall.style.background = "#4c4f56";
        stopTimer(intervalId);
        stopBlink();
        // =========================== VoipIran ===============================

        debug_out("Attempt to hang up non-existant call");
        return false;
    }

    my_session.terminate();
    my_session = false;
    incall = false;
    // -------------------- VOIPIRAN --------------------
    endAudio.pause();
    endAudio.currentTime = 0;
    // -------------------- VOIPIRAN --------------------

    ringAudio.pause();
    ringAudio.currentTime = 0;
    if (ua.isRegistered()) {
        setRegisterStatus("registered");
        setCallButtonStatus(false);
        /* =================== VoipIran ===================== --> */
        voipIranUnRegiterButton.style.display = "none";
        voipIranRegiterButton.style.display = "block";
        /* =================== VoipIran ===================== --> */
        uiElements.unreg_icon.src = "images/wp_unregister_inactive.gif";
        uiElements.dial_icon.src = "images/wp_dial.gif";
        //=======  VOIPIRAN Start set background dial button green ==========
        voipIranDialCall.style.background = "green";
        //=======  VOIPIRAN End set background dial button green ==========
    } else {
        setRegisterStatus("unregistered");
        /* =================== VoipIran ===================== --> */
        voipIranRegiterButton.style.display = "none";
        /* =================== VoipIran ===================== --> */
        uiElements.dial_icon.src = "images/wp_dial.gif";
        //=======  VOIPIRAN Start set background dial button green ==========
        voipIranDialCall.style.background = "green";
        //=======  VOIPIRAN End set background dial button green ==========

        setCallButtonStatus(true);
    }
}

function dialNumber() {
    uiElements.digits.value = voipiran_sid;
    // check if currently in a call
    if (incall) {
        debug_out("Already in a call");
        return false;
    }

    var uri = voipiran_sid + "@" + sip_server;

    var modifierArray = [SIP.Web.Modifiers.addMidLines];
    var options = {
        sessionDescriptionHandlerOptions: {
            constraints: {
                audio: true,
                video: false
            }
        }
    };
    my_session = ua.invite(uri, options, modifierArray);
    incall = true;

    // VOIPIRAN get_translation("attempting") + " - " + uiElements.digits.value) to get_translation("attempting") + " " + uiElements.digits.value)
    setRegisterStatus(
        get_translation("attempting") + " " + uiElements.digits.value
    );
    setCallButtonStatus(true);

    // ---------- VOIPIRAN dial Number ------------
    // caller = uiElements.digits.value;
    caller = voipiran_sid;
    // ---------- VOIPIRAN dial Number ------------

    // assign event handlers to the session
    my_session.on("accepted", function() {
        vm.$data.status.description = "Incall with " + vm.$data.name;
        handleAccepted();
    });
    my_session.on("bye", function(request) {
        vm.$data.status.description = "Ready to call";
        vm.$data.status.showAnimate = false;
        handleBye(request);
    });
    my_session.on("failed", function(response, cause) {
        vm.$data.status.description = "Ready to call";
        vm.$data.status.showAnimate = false;
        if (cause == "WebRTC Error") {
            handleFailed(response, "Canceled");
            Toast.fire({
                text: "Canceled!",
                timer: 1500,
                icon: "info",
                showConfirmButton: false
            });
            return;
        }
        handleFailed(response, cause);
    });
    my_session.on("refer", function() {
        vm.$data.status.description = "Ready to call";
        vm.$data.status.showAnimate = false;
        handleInboundRefer();
    });
    my_session.on("progress", function(progress) {
        vm.$data.status.description = vm.$data.name + " Ringing";
        handleProgress(progress);
    });

    // uiElements.digits.value = "";
}

function setCallButtonStatus(status) {
    if (status) {
        uiElements.dial.setAttribute("class", "button hangup");
        uiElements.dial_icon.src = "images/wp_hangup.gif";
    } else {
        uiElements.dial.setAttribute("class", "button dial");
        uiElements.dial_icon.src = "images/wp_dial.gif";
    }
}

function handleProgress(progress) {
    debug_out("Their end is ringing - " + progress);

    // VOIPIRAN remove - before caller --- (get_translation("ringing") + " - " + caller) to (get_translation("ringing") + " " + caller)
    setRegisterStatus(get_translation("ringing") + " " + caller);

    //======================== VOIPIRAN change endRinging =======================
    // ringAudio.play();
    endAudio.play();
    //======================== VOIPIRAN change endRinging =======================

    // start ringing
    setRinging(true);
    // ------- VOIPIRAN Start SET background red when ringing ------------
    uiElements.dial_icon.src = "images/wp_hangup.gif";
    voipIranDialCall.style.background = "#ff0000";
    startBlink("outGoingCall");
    // ------- VOIPIRAN End SET background red when ringing ------------
}

function handleInvite(my_session) {
    // check if we are in a call already
    if (incall) {
        // we are so reject it
        debug_out("Received INVITE while in a call. Rejecting.");
        var options = {
            statusCode: 486,
            reasonPhrase: "Busy Here"
        };
        my_session.reject(options);
    } else {
        // we are not so good to process it

        // add session event listeners
        my_session.on("accepted", function() {
            // don't show disconnect call anymore
            uiElements.hangoutButton.style.display = "none";
            handleAccepted();
        });
        my_session.on("bye", function(request) {
            // don't show disconnect call anymore
            uiElements.hangoutButton.style.display = "none";
            handleBye(request);
        });
        my_session.on("failed", function(response, cause) {
            // don't show disconnect call anymore
            uiElements.hangoutButton.style.display = "none";
            handleFailed(response, cause);
        });
        my_session.on("refer", function() {
            // don't show disconnect call anymore
            uiElements.hangoutButton.style.display = "none";
            handleInboundRefer();
        });
        my_session.on("trackAdded", function() {
            // don't show disconnect call anymore
            uiElements.hangoutButton.style.display = "none";
            handleTrackAdded(my_session);
        });

        var remoteUri = my_session.remoteIdentity.uri.toString();
        var displayName = my_session.remoteIdentity.displayName;
        var regEx1 = /sip:/;
        var regEx2 = /@.*$/;
        var extension = remoteUri.replace(regEx1, "");
        extension = extension.replace(regEx2, "");
        caller = extension;

        debug_out("Got Invite from <" + extension + '> "' + displayName + '"');
        // ------------- VOIPIRAN Start Change Status ---------------
        // uiElements.reg_status.value = extension + " - " + displayName;
        uiElements.digits.value = extension + "  " + displayName;
        uiElements.reg_status.value = "Calling From";
        // show disconnect button when ringing
        uiElements.hangoutButton.style.display = "inline-block";
        // ------------- VOIPIRAN End Change Status ---------------

        // if auto answer is set answer the call
        if (auto_answer) {
            incall = true;
            debug_out("Auto-Answered Call");
            //=======  VOIPIRAN Start set background dial button red ==========
            voipIranDialCall.style.background = "#ff0000";
            //=======  VOIPIRAN End set background dial button red ==========

            var modifierArray = [SIP.Web.Modifiers.addMidLines];

            options = {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: false
                    }
                }
            };

            my_session.accept(options, modifierArray);
            setCallButtonStatus(true);
        } else {
            // auto answer not enabled
            // ring the phone
            setRinging(true);
        }
    }
    return my_session;
}

function handleTrackAdded(my_session) {
    // We need to check the peer connection to determine which track was added
    var pc = my_session.sessionDescriptionHandler.peerConnection;

    // Gets remote tracks
    var remoteStream = new MediaStream();
    pc.getReceivers().forEach(function(receiver) {
        remoteStream.addTrack(receiver.track);
    });
    uiElements.audio.srcObject = remoteStream;
    uiElements.audio.play();
}

function handleAccepted() {
    debug_out("Session Accepted Event Fired");
    // ====================== VOIPIRAN Start Timer =========================
    startTimer();
    // ====================== VOIPIRAN Start Timer =========================

    // =============== VOIPIRAN pause endRinging ====================

    // --------------- VOIPIRAN CHANGE LABEL ---------------------
    // uiElements.reg_status.value = get_translation("incall") + " - " + caller;
    // uiElements.reg_status.value = get_translation("incall") + " - " + caller;
    // --------------- VOIPIRAN CHANGE LABEL ---------------------

    endAudio.pause();
    endAudio.currentTime = 0;
    // =============== VOIPIRAN pause endRinging ====================

    // They answered stop ringing
    setRinging(false);
}

function handleBye(request) {
    debug_out("Session Bye Event Fired |" + request);
    // ================= VOIPIRAN STOP TIMER ===================
    stopTimer(intervalId);
    // ================= VOIPIRAN STOP TIMER ===================

    if (ua.isRegistered()) {
        setRegisterStatus("registered");
    } else {
        setRegisterStatus("unregistered");
    }
    setCallButtonStatus(false);
    my_session = false;
    incall = false;
}
// VOIPIRAN , there two handleFailed Function , one of them Removed , the last on that executing stayed
function handleFailed(response, cause) {
    debug_out("Session Failed Event Fired | " + response + " | " + cause);
    // check if we are registered and adjust the display accordingly
    if (
        cause == "WebRTC Error" ||
        cause == "WebRTC not supported" ||
        cause == "Canceled"
    ) {
        setRinging(false);
        if (ua.isRegistered()) {
            setRegisterStatus("registered");
        } else {
            setRegisterStatus("unregistered");
        }
        my_session = false;
        setCallButtonStatus(false);
        my_session = false;
        incall = false;
        if (cause == "WebRTC Error" || cause == "WebRTC not supported") {
            WebRTCError();
        }
    }
    // ------------- VOIPIRAN SET BUSY STATE -----------
    if (cause == "Busy") {
        voipiranHangupCall("busy");
        Toast.fire("", "Line Busy", "info");
    }
}

function setRegisterStatus(message) {
    if (message == "registered" || message == "connected") {
        uiElements.reg_icon.src = "images/wp_register_active.gif";
        uiElements.unreg_icon.src = "images/wp_unregister_inactive.gif";
        translated_message = get_translation(message);
    } else if (
        message == "unregistered" ||
        message == "disconnected" ||
        message == "register_failed"
    ) {
        uiElements.reg_icon.src = "images/wp_register_inactive.gif";
        uiElements.unreg_icon.src = "images/wp_unregister_active.gif";
        translated_message = get_translation(message);
    } else {
        translated_message = message;
    }

    if (uiElements.reg_status.type == "text")
        uiElements.reg_status.value = translated_message;
    else uiElements.reg_status.innerHTML = translated_message;
}

function handleInboundRefer() {
    debug_out("Session Refer Event Fired");
}

function WebRTCError() {
    Toast.fire("Error!", get_translation("webrtc_error"), "error");
}

function initialize() {
    // Initialization
    // Dial pad keys
    uiElements.one.addEventListener("click", function() {
        dialPadPressed("1", my_session);
    });
    uiElements.two.addEventListener("click", function() {
        dialPadPressed("2", my_session);
    });
    uiElements.three.addEventListener("click", function() {
        dialPadPressed("3", my_session);
    });
    uiElements.four.addEventListener("click", function() {
        dialPadPressed("4", my_session);
    });
    uiElements.five.addEventListener("click", function() {
        dialPadPressed("5", my_session);
    });
    uiElements.six.addEventListener("click", function() {
        dialPadPressed("6", my_session);
    });
    uiElements.seven.addEventListener("click", function() {
        dialPadPressed("7", my_session);
    });
    uiElements.eight.addEventListener("click", function() {
        dialPadPressed("8", my_session);
    });
    uiElements.nine.addEventListener("click", function() {
        dialPadPressed("9", my_session);
    });
    uiElements.zero.addEventListener("click", function() {
        dialPadPressed("0", my_session);
    });
    uiElements.star.addEventListener("click", function() {
        dialPadPressed("*", my_session);
    });
    uiElements.pound.addEventListener("click", function() {
        dialPadPressed("#", my_session);
    });

    // Send DTMF button
    uiElements.send_dtmf.addEventListener("click", function() {
        sendButton(my_session);
    });

    // Dial Button
    uiElements.dial.addEventListener("click", function() {
        dialButton();
    });

    // Mute	 Button
    uiElements.mic_mute.addEventListener("click", function() {
        muteButton();
    });

    // Volume Buttons
    uiElements.vol_up.addEventListener("click", function() {
        volumeUpButton();
    });
    uiElements.vol_down.addEventListener("click", function() {
        volumeDownButton();
    });

    // Register Button
    uiElements.register.addEventListener("click", function() {
        registerButton(ua);
    });

    // Unregister Button
    uiElements.unregister.addEventListener("click", function() {
        unregisterButton(ua);
    });

    // Change text language for some elements
    uiElements.send_dtmf.innerHTML = get_translation("send");
    uiElements.reg_status.value = get_translation("connecting");

    // create the User Agent
    ua = new SIP.UA(ua_config);

    // assign event handlers
    ua.on("connected", function() {
        setRegisterStatus("connected");
        /* =================== VoipIran ===================== --> */
        voipIranRegiterButton.style.display = "none";
        /* =================== VoipIran ===================== --> */
    });

    ua.on("registered", function() {
        setRegisterStatus("registered");
        /* =================== VoipIran ===================== --> */
        voipIranUnRegiterButton.style.display = "none";
        voipIranRegiterButton.style.display = "block";
        /* =================== VoipIran ===================== --> */

        // If auto dial out is enabled and a dial_number is given, do the auto dialing
        if (auto_dial_out && uiElements.digits.value.length > 0) {
            dialButton();
        }

        //added By ViciExperts to automatically login agent as soon as the webphone is loaded.
        if (auto_login) {
            try {
                parent.NoneInSessionCalL("LOGIN");
            } catch (err) {
                console.log(err);
            }
        }
    });

    ua.on("unregistered", function() {
        setRegisterStatus("unregistered");
        /* =================== VoipIran ===================== --> */
        voipIranRegiterButton.style.display = "none";
        /* =================== VoipIran ===================== --> */
    });

    ua.on("disconnected", function() {
        setRegisterStatus("disconnected");
    });

    ua.on("registrationFailed", function() {
        setRegisterStatus("register_failed");
        /* =================== VoipIran ===================== --> */
        voipIranRegiterButton.style.display = "none";
        /* =================== VoipIran ===================== --> */
    });

    ua.on("invite", session => {
        my_session = handleInvite(session);
    });
}

function getUserMediaSuccess(stream) {
    console.log("getUserMedia succeeded", stream);
    mediaStream = stream;
}

function getUserMediaFailure(e) {
    console.error("getUserMedia failed:", e);
}

function processDisplaySettings() {
    if (hide_dialpad) {
        uiElements.dialpad.setAttribute("hidden", true);
    }
    if (hide_dialbox) {
        uiElements.digits.setAttribute("hidden", true);
    }
    if (hide_mute) {
        uiElements.mic_mute.setAttribute("hidden", true);
    }
    if (hide_volume) {
        uiElements.vol_down.setAttribute("hidden", true);
        uiElements.vol_up.setAttribute("hidden", true);
    }
}

function setRinging(ringing_status) {
    if (ringing_status) {
        ringing = true;
        startBlink();
        ringAudio.play();
    } else {
        ringing = false;
        stopBlink();
        ringAudio.pause();
        ringAudio.currentTime = 0;
    }
}

/*
	Hardcoded messages. Can be translated by loading translations.js
*/
function get_translation(text) {
    console.log("-------------------- get translation ---------------------");
    // Default language. This can be overriden by defining the 'language' variable before loading this file
    if (typeof language == "undefined" || language.length == 0) language = "en";

    if (typeof vici_translations == "undefined") {
        vici_translations = {
            en: {
                registered: "Ready to Dial",
                unregistered: "Unregistered",
                connecting: "Connecting...",
                disconnected: "Disconnected",
                connected: "Connected",
                register_failed: "Reg. failed",
                incall: "Incall",
                ringing: "Ringing",
                attempting: "Attempting",
                send: "Send",
                webrtc_error:
                    "Something went wrong with WebRTC. Either your browser does not support the necessary WebRTC functions, you did not allow your browser to access the microphone, or there is a configuration issue. Please check your browsers error console for more details. For a list of compatible browsers please vist http://webrtc.org/"
            }
        };
    }
    // If selected language doesn't exist, fallback to english
    if (typeof vici_translations[language] == "undefined")
        vici_translations[language] = vici_translations["en"];

    return vici_translations[language][text];
}

// ===================== Start VoipIran Development ==========================
// request permission on page load
document.addEventListener("DOMContentLoaded", function() {
    if (!Notification) {
        alert(
            "Desktop notifications not available in your browser. Try Chromium."
        );
        return;
    }

    if (Notification.permission !== "granted") Notification.requestPermission();
});

function notifyMe() {
    // in customer mode its not necessary
    return;
    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
        var notification = new Notification("Webphone Ringing...", {
            icon: "images/ringing.png",
            body: "Incoming Call : " + uiElements.reg_status.value
        });

        notification.addEventListener("click", function(event) {
            // window.opener.doSome();
        });

        notification.onclick = function() {
            window.opener.doSome();
            //   openFullscreen();
            // alert('pick up...');
            //   window.open("http://stackoverflow.com/a/13328397/1269037");
        };
    }
    // =====================  focus the VOIPIRA Webphone On Top ===================
    window.opener.doSome();
}

// temporary disabled
var elem = document.documentElement;

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
// temporary disabled

// set Digits input call On Enter key
document.getElementById("digits").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        dialButton();
    }
});

// set default background color of Dial Button Green
voipIranDialCall.style.background = "green";

// initial clock timer
let minutes = 0,
    seconds = 0,
    timerLabel;
var totalSeconds = 0;
let intervalId;

function setTime() {
    ++totalSeconds;
    seconds = pad(totalSeconds % 60);
    minutes = pad(parseInt(totalSeconds / 60));
    timerLabel = minutes + ":" + seconds;
    // uiElements.digits.value = timerLabel;
    // uiElements.dial.value = timerLabel;
    //   uiElements.speaking.innerText = timerLabel + " speaking";
    vm.$data.status.spinnerLoading = false;
    vm.$data.status.spekingTime = timerLabel;
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function startTimer() {
    intervalId = setInterval(setTime, 1000);
}

function stopTimer(id) {
    minutes = 0;
    seconds = 0;
    totalSeconds = 0;
    timerLabel = null;
    //   uiElements.speaking.innerText = null;
    vm.$data.status.spekingTime = null;
    console.log("VOIPIRAN DISABLE InterVal ID -------- IS " + id);
    clearInterval(id);
}

// dont let resize the window
var size = [window.outerWidth, window.outerHeight];
window.addEventListener("resize", function() {
    window.resizeTo(size[0], size[1]);
});

// Voipiran hangupCall Event
uiElements.hangoutButton.addEventListener("click", function() {
    voipiranHangupCall();
});

// ---------- Start implement backSpace ----------
document.addEventListener("keydown", KeyCheck); //or however you are calling your method
function KeyCheck(event) {
    var KeyID = event.keyCode;
    switch (KeyID) {
        case 8:
            VoipIranBackSpace();
            break;
        case 13:
            dialButton();
            break;
        case 46:
            // Swal.fire('',"delete",'success');
            break;
        case 96:
            dialPadPressed(0, false);
            break;
        case 97:
            dialPadPressed(1, false);
            break;
        case 98:
            dialPadPressed(2, false);
            break;
        case 99:
            dialPadPressed(3, false);
            break;
        case 100:
            dialPadPressed(4, false);
            break;
        case 101:
            dialPadPressed(5, false);
            break;
        case 102:
            dialPadPressed(6, false);
            break;
        case 103:
            dialPadPressed(7, false);
            break;
        case 104:
            dialPadPressed(8, false);
            break;
        case 105:
            dialPadPressed(9, false);
            break;
        default:
            // Swal.fire('','keyid '+KeyID,'success');
            break;
    }
}

function VoipIranBackSpace() {
    var value = uiElements.digits.value;
    uiElements.digits.value = value.substr(0, value.length - 1);
}
// ---------- End implement backSpace ----------

// ===================== End VoipIran Development ==========================
