import Vue from "vue";

/**vue notification */
import Notifications from "vue-notification";
Vue.use(Notifications);

/**vue numeric input */
// import VueNumericInput from "vue-numeric-input";
// Vue.use(VueNumericInput);
import MaskedInput from "vue-text-mask";

/**vue dot spinner */
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

/**vue native notification for browser notifications*/
import VueNativeNotification from 'vue-native-notification'
Vue.use(VueNativeNotification, {
    // Automatic permission request before
    // showing notification (default: true)
    requestOnNotify: true
})
Vue.notification.requestPermission()

/**axios for ajax calls */
import Axios from 'axios'

/**ngprogress show beautiful progress top bar */
import NProgress from 'vue-nprogress'
Vue.use(NProgress)
const nprogress = new NProgress()
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
/** ---------------- CONCEPTS And File Map -------------
 * Inbound Calls => calls we recieve
 * Outbound Calling => calls will make them
 * audioCall() method => make Audio Call with dialledNumber
 * cancelSession() method => If it is an outgoing SIP session that has not been established , need to cancel the session
 * byeSession() method => on any established SIP session, you need to bye the session
 *
 */

// Sounds Meter Class
// ==================
class SoundMeter {
    constructor(sessionId, lineNum) {
        var audioContext = null;
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            console.warn("AudioContext() LocalAudio not available... its fine.");
        }
        if (audioContext == null) return null;
        this.context = audioContext;
        this.source = null;

        this.lineNum = lineNum;
        this.sessionId = sessionId;

        this.captureInterval = null;
        this.levelsInterval = null;
        this.networkInterval = null;
        this.startTime = 0;

        this.ReceiveBitRateChart = null;
        this.ReceiveBitRate = [];
        this.ReceivePacketRateChart = null;
        this.ReceivePacketRate = [];
        this.ReceivePacketLossChart = null;
        this.ReceivePacketLoss = [];
        this.ReceiveJitterChart = null;
        this.ReceiveJitter = [];
        this.ReceiveLevelsChart = null;
        this.ReceiveLevels = [];
        this.SendBitRateChart = null;
        this.SendBitRate = [];
        this.SendPacketRateChart = null;
        this.SendPacketRate = [];

        this.instant = 0; // Primary Output indicator

        this.AnalyserNode = this.context.createAnalyser();
        this.AnalyserNode.minDecibels = -90;
        this.AnalyserNode.maxDecibels = -10;
        this.AnalyserNode.smoothingTimeConstant = 0.85;
    }
    connectToSource(stream, callback) {
        console.log("SoundMeter connecting...");
        try {
            this.source = this.context.createMediaStreamSource(stream);
            this.source.connect(this.AnalyserNode);
            // this.AnalyserNode.connect(this.context.destination); // Can be left unconnected
            this._start();

            callback(null);
        } catch (e) {
            console.error(e); // Probably not audio track
            callback(e);
        }
    }
    _start() {
        var self = this;
        self.instant = 0;
        self.AnalyserNode.fftSize = 32; // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048
        self.dataArray = new Uint8Array(self.AnalyserNode.frequencyBinCount);

        this.captureInterval = window.setInterval(function () {
            self.AnalyserNode.getByteFrequencyData(self.dataArray); // Populate array with data from 0-255

            // Just take the maximum value of this data
            self.instant = 0;
            for (var d = 0;d < self.dataArray.length;d++) {
                if (self.dataArray[d] > self.instant) self.instant = self.dataArray[d];
            }
        }, 1);
    }
    stop() {
        console.log("Disconnecting SoundMeter...");
        window.clearInterval(this.captureInterval);
        this.captureInterval = null;
        window.clearInterval(this.levelsInterval);
        this.levelsInterval = null;
        window.clearInterval(this.networkInterval);
        this.networkInterval = null;
        try {
            this.source.disconnect();
        } catch (e) { }
        this.source = null;
        try {
            this.AnalyserNode.disconnect();
        } catch (e) { }
        this.AnalyserNode = null;
        try {
            this.context.close();
        } catch (e) { }
        this.context = null;

        // Save to IndexDb
        var QosData = {
            ReceiveBitRate: this.ReceiveBitRate,
            ReceivePacketRate: this.ReceivePacketRate,
            ReceivePacketLoss: this.ReceivePacketLoss,
            ReceiveJitter: this.ReceiveJitter,
            ReceiveLevels: this.ReceiveLevels,
            SendBitRate: this.SendBitRate,
            SendPacketRate: this.SendPacketRate,
        };
    }
}

/**disable vue productionTip , You are runnig vue development lab lab lab! */
Vue.config.productionTip = false

/**handle sound files with Howl */
import { Howl } from 'howler';

var Ringtone = new Howl({
    src: [RingtoneSrc],
    loop: true,
})

var EarlyMedia_European = new Howl({
    src: [EarlyMedia_EuropeanSrc],
    loop: true,
})

new Vue({
    el: "#app",
    nprogress,
    data: {
        /**Start client config ui */
        status: {
            show: false /** to not show the first animation we have to not show the div */,
            showAnimate: false,
            spinnerColor: "white",
            spinnerSize: "7px",
            description: null /** like 'calling to administrator...' */,
            spinnerLoading: true,
            spekingTime: null
        },
        name: null,
        /**End client config ui */

        /**configuration */
        hostingPrefex: "",
        isReRegister: 'loading',
        userAgent: null,
        profileName: null, /**"Mohammad Mahdi Kargar" */
        SipUsername: null,/**"3007" */
        SipPassword: null,/**"pass3007" */
        wssServer: null,/**"192.168.1.61" */
        WebSocketPort: null,/**"8089" */
        ServerPath: "/ws",
        session: null,

        /**Audio Devices and Settings */
        HasAudioDevice: false,
        HasSpeakerDevice: false,
        AudioinputDevices: [],
        SpeakerDevices: [],
        AutoGainControl: "1",
        EchoCancellation: "1",
        NoiseSuppression: "1",
        audioBlobs: {},

        /**Dial Config */
        dialledNumber: "2002",

        /**Appereance */
        statusLabel: "Ready",
        copyright: "VOIPIRAN",
        notificationDuration: 1000,
        dialledNumberFocuse: false,
        key: [false, false, false, false, false, false, false, false, false, false, false, false],

        /**buttons show manage */
        readyButtons: true, /** Ready Mode Buttons */
        outgoinButtons: false,
        incomingcallButtons: false,
        callInProgressButtons: false,
    },
    methods: {
        /**get User info */
        async getUserInformation() {
            try {
                // let res = await Axios.post('get-user-info')
                this.profileName = "Voipiran"
                this.wssServer = wssServer //"192.168.1.61"
                this.WebSocketPort = WebSocketPort // "8089"
                this.SipUsername = SipUsername // "3007"
                this.enable = true
                this.SipPassword = SipPassword //"pass3007"
                /**res.data.password */
            } catch (error) {
                console.error(error)
            }
        },

        /**retry register and create userAgent */
        retry() {
            this.$nprogress.done()
            this.$nprogress.start()
            this.$nprogress.inc(0.4)
            setTimeout(() => {
                location.reload()
                this.$nprogress.done()
            }, 1000)
        },

        /**Make User Agent
         * First Off all we have to make user agent
         */
        createUserAgent() {
            /**use this inside anynomouse functions */

            let ts = this
            try {
                var options = {
                    displayName: "Mehdi",
                    uri: this.SipUsername + "@" + this.wssServer,
                    transportOptions: {
                        wsServers: "wss://" + this.wssServer + ":" + this.WebSocketPort + "" + this.ServerPath,
                        traceSip: false,
                        connectionTimeout: 15,
                        maxReconnectionAttempts: 99,
                        reconnectionTimeout: 15,
                        // keepAliveInterval: 30 // Uncomment this and make this any number greater then 0 for keep alive...
                        // NB, adding a keep alive will NOT fix bad interent, if your connection cannot stay open (permanent WebSocket Connection) you probably
                        // have a router or ISP issue, and if your internet is so poor that you need to some how keep it alive with empty packets
                        // upgrade you internt connection. This is voip we are talking about here.
                    },
                    sessionDescriptionHandlerFactoryOptions: {
                        peerConnectionOptions: {
                            alwaysAcquireMediaFirst: true, // Better for firefox, but seems to have no effect on others
                            iceCheckingTimeout: 500,
                            rtcConfiguration: {},
                        },
                    },
                    authorizationUser: this.SipUsername,
                    password: this.SipPassword,
                    registerExpires: 300,
                    hackWssInTransport: true,
                    hackIpInContact: true,
                    userAgentString: "VoipIran Phone (SipJS - 0.11.6)",
                    autostart: false,
                    register: false,
                    rel100: SIP.C.supported.UNSUPPORTED, // UNSUPPORTED | SUPPORTED | REQUIRED NOTE: rel100 is not supported
                }
                // Add (Hardcode) other RTCPeerConnection({ rtcConfiguration }) config dictionary options here
                // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
                // options.sessionDescriptionHandlerFactoryOptions.peerConnectionOptions.rtcConfiguration

                this.userAgent = new SIP.UA(options)
                console.log("Creating User Agent... Done")
            } catch (e) {
                console.error("Error creating User Agent: " + e)
                alert(e.message)
                return
            }

            // UA Register events
            this.userAgent.on("registered", function () {
                // This code fires on re-resiter after session timeout
                // to ensure that events are not fired multiple times
                // a isReRegister state is kept.
                if (!ts.isReRegister) {
                    console.log("Registered!")
                    // Start Subscribe Loop
                    //   SubscribeAll()
                }
                ts.isReRegister = true
            })

            this.userAgent.on("registrationFailed", function (response, cause) {
                console.log("Registration Failed: " + cause);
                ts.isReRegister = false
            })

            this.userAgent.on("unregistered", function () {
                console.log("Unregistered, bye!")
                // We set this flag here so that the re-register attepts are fully completed.
                ts.isReRegister = false
            })

            // UA transport
            this.userAgent.on("transportCreated", function (transport) {
                console.log("Transport Object Created")

                // Transport Events
                transport.on("connected", function () {
                    console.log("Connected to Web Socket!")
                    // Auto start register
                    window.setTimeout(function () {
                        ts.register()
                    }, 500)
                })

                transport.on("disconnected", function () {
                    console.log("Disconnected from Web Socket!")
                    // We set this flag here so that the re-register attepts are fully completed.
                    ts.isReRegister = false
                })

                transport.on("transportError", function () {
                    console.log("Web Socket error!")
                    ts.isReRegister = false
                })

            })

            // Inbound Calls
            this.userAgent.on("invite", function (session) {
                ts.session = session
                ts.cancelRejectBy()
                // ts.receiveCall(session);
            })

            // Start the WebService Connection loop
            console.log("Connecting to Web Socket...")
            this.userAgent.start()
        },

        /**register user agent! */
        register() {
            if (this.userAgent == null || this.userAgent.isRegistered()) return;
            console.log("Sending Registration...");
            try {
                this.userAgent.register()
                console.log("Registered!")
            } catch (error) {
                this.$notify({
                    text: error,
                    type: "info",
                    group: 'registerInfo'
                });
            }
        },

        /**unregister user agent! */
        unregister() {
            if (this.userAgent == null || !this.userAgent.isRegistered()) return;

            console.log("Unsubscribing...");
            try {
                // UnsubscribeAll();
            } catch (e) { }

            console.log("Disconnecting...");
            this.userAgent.unregister();

            this.isReRegister = false;
            alert("unregistered");
        },

        /**==================== Outbound Calling ========================== */

        /**make call and ... */
        audioCall(dialNumber = 2222, name = 'some') {
            let lineObj = { LineNumber: dialNumber , SipSession: null }

            /**make this instance */
            let ts = this

            ts.dialledNumber = dialNumber
            ts.name = name

            /**client ui */
            ts.spinnerLoading = true;
            ts.status.show = true;
            ts.status.showAnimate = ts.status.showAnimate ? false : true;

            /**check dialed number not empty */
            if (!ts.dialledNumber) {
                ts.$notify({
                    text: "Enter Number!",
                    type: "info",
                    group: 'registerInfo'
                })
                return;
            }

            /**show making call spinner loading */
            // this.$notify({
            //   text: "making Call...",
            //   type: "info",
            //   group: 'registerInfo'
            // })

            /**check user agent registered */
            if (ts.userAgent == null) return
            if (ts.userAgent.isRegistered() == false) return
            if (lineObj == null) return

            /**check microphone */
            if (ts.HasAudioDevice == false) {
                ts.$notify({
                    text: "No Microphone Found!",
                    type: "info",
                    group: 'registerInfo'
                })
                console.error("No Mic Found!")
                return;
            }

            var supportedConstraints = navigator.mediaDevices.getSupportedConstraints()

            var spdOptions = {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: "default" },
                        video: false,
                    },
                },
            };

            // Configure Audio
            var currentAudioDevice = ts.getAudioSrcID()
            if (currentAudioDevice != "default") {
                var confirmedAudioDevice = false
                for (var i = 0;i < ts.AudioinputDevices.length;++i) {
                    if (currentAudioDevice == ts.AudioinputDevices[i].deviceId) {
                        confirmedAudioDevice = true
                        break
                    }
                }
                if (confirmedAudioDevice) {
                    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = { exact: currentAudioDevice }
                } else {
                    console.warn("The audio device you used before is no longer available, default settings applied.")
                    localDB.setItem("AudioSrcId", "default")
                }
            }

            // Add additional Constraints
            if (supportedConstraints.autoGainControl) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl = ts.AutoGainControl
            }
            if (supportedConstraints.echoCancellation) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation = ts.EchoCancellation
            }
            if (supportedConstraints.noiseSuppression) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression = ts.NoiseSuppression
            }

            // Invite
            console.log("INVITE (audio): " + ts.dialledNumber + "@" + ts.wssServer, spdOptions)
            lineObj.SipSession = ts.userAgent.invite("sip:" + ts.dialledNumber + "@" + ts.wssServer, spdOptions)
            var startTime = moment.utc()
            lineObj.SipSession.data.line = lineObj.LineNumber
            lineObj.SipSession.data.calldirection = "outbound"
            lineObj.SipSession.data.dst = ts.dialledNumber
            lineObj.SipSession.data.callstart = startTime.format("YYYY-MM-DD HH:mm:ss UTC")
            lineObj.SipSession.data.callTimer = window.setInterval(function () {
                var now = moment.utc()
                var duration = moment.duration(now.diff(startTime))
                /**this is the timer we wait for the call to connect */
                // ts.statusLabel = ts.formatShortDuration(duration.asSeconds())
            }, 1000)
            lineObj.SipSession.data.VideoSourceDevice = null
            lineObj.SipSession.data.AudioSourceDevice = ts.getAudioSrcID()
            lineObj.SipSession.data.AudioOutputDevice = ts.getAudioOutputID()
            lineObj.SipSession.data.terminateby = "them"
            lineObj.SipSession.data.withvideo = false
            lineObj.SipSession.data.earlyReject = false

            // Do Nessesary UI Wireup
            ts.wireupAudioSession(lineObj)
        },

        // Session Wireup
        // ==============
        wireupAudioSession(lineObj) {
            let ts = this
            if (lineObj == null) return

            this.session = lineObj.SipSession

            this.session.on("progress", function (response) {

                /**
                 * call in progress fired in two status
                 * in outbound calls
                 * and in inbound calls
                */
                ts.changeButtons('outgoing')

                // Provisional 1xx
                if (response.status_code == 100) {
                    // ts.$notify({
                    //   type : "info",
                    //   text : "Trying...",
                    //   group: 'registerInfo'
                    // })
                    ts.status.description = 'Trying...'
                    ts.statusLabel = 'Trying...'

                } else if (response.status_code == 180) {
                    // ts.$notify({
                    //   type: "info",
                    //   text: "Ringing...",
                    //   group: 'registerInfo'
                    // })

                    /**ui changes */
                    ts.status.description = 'Ringing...'
                    ts.statusLabel = 'Ringing...'

                    // var soundFile = ts.audioBlobs.EarlyMedia_European;
                    EarlyMedia_European.play()
                    // Play Early Media
                    // console.log("Audio:", soundFile.url);
                    // var earlyMedia = new Audio(soundFile.blob);
                    // earlyMedia.preload = "auto";
                    // earlyMedia.loop = true;
                    // earlyMedia.oncanplaythrough = function (e) {
                    //   if (typeof earlyMedia.sinkId !== "undefined" && ts.getAudioOutputID() != "default") {
                    //     earlyMedia
                    //       .setSinkId(ts.getAudioOutputID())
                    //       .then(function () {
                    //         console.log("Set sinkId to:", ts.getAudioOutputID());
                    //       })
                    //       .catch(function (e) {
                    //         console.warn("Failed not apply setSinkId.", e);
                    //       });
                    //   }
                    //   earlyMedia
                    //     .play()
                    //     .then(function () {
                    //       // Audio Is Playing
                    //     })
                    //     .catch(function (e) {
                    //       console.warn("Unable to play audio file.", e);
                    //     });
                    // };
                    this.data.earlyMedia = EarlyMedia_European;
                } else if (response.status_code === 183) {
                    // ts.$notify({
                    //   type: "info",
                    //   text: response.reason_phrase + "...",
                    //   group: 'registerInfo'
                    // })
                    ts.status.description = response.reason_phrase + "..."
                    ts.statusLabel = response.reason_phrase + "..."

                    // Special Early Media Handling
                    if (response.body != "" && this.hasOffer && !this.dialog) {
                        // Confirm the dialog, eventhough it's a provisional answer
                        if (!this.createDialog(response, "UAC")) {
                            console.warn("Could not create Dialog ");
                            return;
                        }

                        // this ensures that 200 will not try to set description
                        this.hasAnswer = true;

                        // Force the session status
                        this.status = SIP.Session.C.STATUS_EARLY_MEDIA;

                        // Set the SDP from the response, so the media can connect
                        // (Assuming that the response is a vlid SDP)
                        this.sessionDescriptionHandler.setDescription(response.body).catch(function (reason) {
                            console.warn("Failed to set SDP in 183 response: ", reason);
                        });
                    }
                } else {
                    // 181 = Call is Being Forwarded
                    // 182 = Call is queued (Busy server!)
                    // 199 = Call is Terminated (Early Dialog)
                    // ts.$notify({
                    //   type: "info",
                    //   text: response.reason_phrase + "...",
                    //   group: 'registerInfo'
                    // })
                    ts.status.description = response.reason_phrase + "..."
                    ts.statusLabel = response.reason_phrase + "..."

                }
            })

            this.session.on("trackAdded", function () {
                var pc = this.sessionDescriptionHandler.peerConnection;

                // Gets Remote Audio Track (Local audio is setup via initial GUM)
                var remoteStream = new MediaStream();
                pc.getReceivers().forEach(function (receiver) {
                    if (receiver.track && receiver.track.kind == "audio") {
                        remoteStream.addTrack(receiver.track);
                    }
                });
                ts.$notify({
                    text: "remote audio play",
                    type: "info",
                })
                return
                var remoteAudio = $("#line-" + lineObj.LineNumber + "-remoteAudio").get(0);
                remoteAudio.srcObject = remoteStream;
                remoteAudio.onloadedmetadata = function (e) {
                    if (typeof remoteAudio.sinkId !== "undefined") {
                        remoteAudio
                            .setSinkId(getAudioOutputID())
                            .then(function () {
                                console.log("sinkId applied: " + getAudioOutputID());
                            })
                            .catch(function (e) {
                                console.warn("Error using setSinkId: ", e);
                            });
                    }
                    remoteAudio.play();
                };
            })

            this.session.on("accepted", function (data) {

                /**we are trying to make a outgoing call */
                ts.changeButtons('inprogress')

                /**
                 * we have to get the caller name and id 
                 * the default is incoming
                 * */
                let name = ts.session.remoteIdentity.displayName
                /**check if its outgoing call */
                if (this.data.calldirection == "outbound") {
                    name = this.data.dst
                }

                if (this.data.earlyMedia) {
                    // this.data.earlyMedia.pause();
                    // this.data.earlyMedia.removeAttribute("src");
                    // this.data.earlyMedia.load();
                    // this.data.earlyMedia = null;
                    this.data.earlyMedia.stop()
                    this.data.earlyMedia = null
                }

                window.clearInterval(this.data.callTimer);
                var startTime = moment.utc();
                this.data.callTimer = window.setInterval(function () {
                    var now = moment.utc();
                    var duration = moment.duration(now.diff(startTime));

                    // ts.$notify({
                    //   type: "success",
                    //   text: ts.formatShortDuration(duration.asSeconds()),
                    // })
                    ts.status.description = "Incall " + ts.name + " - " + ts.formatShortDuration(duration.asSeconds())
                    ts.statusLabel = "Incall " + ts.name + " - " + ts.formatShortDuration(duration.asSeconds())

                }, 1000);

                // Audo Monitoring
                lineObj.LocalSoundMeter = ts.startLocalAudioMediaMonitoring(lineObj.LineNumber, this)
                lineObj.RemoteSoundMeter = ts.startRemoteAudioMediaMonitoring(lineObj.LineNumber, this)

                // ts.$notify({
                //   text: "Call in Progress!",
                //   type: "info",
                //   group: 'registerInfo'
                // })
                ts.status.description = 'Call in Progress!'
                ts.statusLabel = 'Call in Progress!'
            })

            this.session.on("rejected", function (response, cause) {
                // ts.$notify({
                //   type: "info",
                //   text: "Call Rejected" + ": " + cause,
                //   group: 'registerInfo'
                // })

                /**Ui Changes */
                ts.status.showAnimate = false
                ts.changeButtons('ready')

                ts.status.description = "Call Rejected" + ": " + cause
                ts.statusLabel = "Call Rejected" + ": " + cause

                // Should only apply befor answer

                console.log("Call rejected: " + cause);
                ts.teardownSession(lineObj, response.status_code, response.reason_phrase);
            })

            this.session.on("failed", function (response, cause) {
                // ts.$notify({
                //   type: "info",
                //   text: "failed!!!",
                //   group: 'registerInfo'
                // })
                ts.status.showAnimate = false
                ts.status.description = "Call Failed"
                ts.statusLabel = "Call Failed"
                ts.changeButtons('ready')

                return
                $(MessageObjId).html(lang.call_failed + ": " + cause);
                console.log("Call failed: " + cause);
                teardownSession(lineObj, 0, "Call failed");
            })

            this.session.on("cancel", function () {
                // ts.$notify({
                //   type: "info",
                //   text: "cancel!!!",
                //   group: 'registerInfo'
                // })
                ts.status.showAnimate = false
                ts.status.description = "Call Canceled!"
                ts.statusLabel = "Call Canceled!"
                ts.changeButtons('ready')

                return;
                $(MessageObjId).html(lang.call_cancelled);
                console.log("Call Cancelled");
                teardownSession(lineObj, 0, "Cancelled by caller");
            })

            // referRequested
            // replaced
            this.session.on("bye", function () {
                // ts.$notify({
                //   text: "Call ended, bye!",
                //   type: "info",
                //   group: 'registerInfo'
                // })
                ts.status.showAnimate = false
                ts.status.description = 'Call Ended , By!'
                ts.statusLabel = 'Call Ended , By!'
                ts.changeButtons('ready')

                ts.teardownSession(lineObj, 16, "Normal Call clearing");
            })

            this.session.on("terminated", function (message, cause) {
                // ts.$notify({
                //   type: "info",
                //   text: "terminated!!!",
                //   group: 'registerInfo'
                // })
                ts.status.showAnimate = false
                ts.status.description = "Call terminated!"
                ts.statusLabel = "Call terminated!"
                ts.changeButtons('ready')

                return;
                console.log("Session terminated");
            })

            this.session.on("reinvite", function (newSession) {
                // ts.$notify({
                //   type: "info",
                //   text: "reinvite!!!",
                //   group: 'registerInfo'
                // })        
                ts.status.description = 'Call Reinvited!'
                ts.statusLabel = 'Call Reinvited!'
                ts.changeButtons('ready')

                return
                console.log("Session re-invited!", newSession);
            })

            //dtmf
            this.session.on("directionChanged", function () {
                // ts.$notify({
                //   type: "info",
                //   text: "directionChanged!!!",
                //   group: 'registerInfo'
                // })        
                ts.status.description = 'Direction Changed!'
                ts.statusLabel = 'Direction Changed!'
                ts.changeButtons('ready')

                return
                var direction = this.sessionDescriptionHandler.getDirection();
                console.log("Direction Change: ", direction);

                // Custom Web hook
                if (typeof web_hook_on_modify !== "undefined") web_hook_on_modify("directionChanged", this);
            })
        },

        /**
         * check the session status
         * and cancel , reject or bye the session based on the its need!
         * @returns cancel session anyway
         */
        cancelRejectBy() {
            if (!this.session) return

            /**check the call
             * and do prepare action
             */
            switch (this.session.status) {
                case 2:
                    /**outgoing call , cancell the call */
                    this.cancelSession()
                    break;

                case 4:
                    /**incoming call , reject the call */
                    this.rejectSession()
                    break;

                case 12:
                    /**in progress call , end the call */
                    this.byeSession()
                    break;

                default:
                    break;
            }
        },

        /**CancelSession
         * If it is an outgoing SIP session that has not been established
         * need to cancel the session
         */
        cancelSession() {
            if (!this.session) return

            console.log("Cancelling session : ")
            this.session.cancel()
            this.session = null
            // this.$notify({
            //   text : "Call Canceled!",
            //   type : "info",
            //   group: 'registerInfo'
            // })
            ts.status.description = 'Call Canceled'
            this.statusLabel = 'Call Canceled'
            this.makingCall = false
        },

        /**BySession
         * on any established SIP session
         * you need to bye the
         */
        byeSession() {
            if (!this.session) return;

            console.log("Bye session");
            this.session.bye();
            this.session = null;
            this.$notify({
                text: "Call ended, bye!",
                type: "info",
            });
        },

        /**Reject Invited Session
         * To reject the INVITE use the reject() function on the invitation
         */
        rejectSession() {
            if (!this.session) return;

            console.log("Reject Invite!");
            this.session.reject();
            this.session = null;
            this.$notify({
                text: "Call Rejected!!",
                type: "info",
                group: 'registerInfo'
            });
        },

        startRemoteAudioMediaMonitoring(lineNum, session) {
            console.log("Creating RemoteAudio AudioContext on Line:" + lineNum);

            // Create local SoundMeter
            var soundMeter = new SoundMeter(session.id, lineNum);
            if (soundMeter == null) {
                console.warn("AudioContext() RemoteAudio not available... it fine.");
                return null;
            }

            // Ready the getStats request
            var remoteAudioStream = new MediaStream();
            var audioReceiver = null;
            var pc = session.sessionDescriptionHandler.peerConnection;
            pc.getReceivers().forEach(function (RTCRtpReceiver) {
                if (RTCRtpReceiver.track && RTCRtpReceiver.track.kind == "audio") {
                    if (audioReceiver == null) {
                        remoteAudioStream.addTrack(RTCRtpReceiver.track);
                        audioReceiver = RTCRtpReceiver;
                    } else {
                        console.log("Found another Track, but audioReceiver not null");
                        console.log(RTCRtpReceiver);
                        console.log(RTCRtpReceiver.track);
                    }
                }
            });

            // Connect to Source
            soundMeter.connectToSource(remoteAudioStream, function (e) {
                if (e != null) return;

                // Create remote SoundMeter
                console.log("SoundMeter for RemoteAudio Connected, displaying levels for Line: " + lineNum);
                soundMeter.levelsInterval = window.setInterval(function () {
                    // Calculate Levels (0 - 255)
                    var instPercent = (soundMeter.instant / 255) * 100;
                }, 50);
            });

            return soundMeter;
        },

        startLocalAudioMediaMonitoring(lineNum, session) {
            console.log("Creating LocalAudio AudioContext on line " + lineNum);

            // Create local SoundMeter
            var soundMeter = new SoundMeter(session.id, lineNum);
            if (soundMeter == null) {
                console.warn("AudioContext() LocalAudio not available... its fine.");
                return null;
            }

            // Ready the getStats request
            var localAudioStream = new MediaStream();
            var audioSender = null;
            var pc = session.sessionDescriptionHandler.peerConnection;
            pc.getSenders().forEach(function (RTCRtpSender) {
                if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
                    if (audioSender == null) {
                        console.log("Adding Track to Monitor: ", RTCRtpSender.track.label);
                        localAudioStream.addTrack(RTCRtpSender.track);
                        audioSender = RTCRtpSender;
                    } else {
                        console.log("Found another Track, but audioSender not null");
                        console.log(RTCRtpSender);
                        console.log(RTCRtpSender.track);
                    }
                }
            });

            return soundMeter;
        },

        /**TeadDown Session! */
        teardownSession(lineObj, reasonCode, reasonText) {
            if (lineObj == null || lineObj.SipSession == null) return;

            var session = lineObj.SipSession;
            if (session.data.teardownComplete == true) return;
            session.data.teardownComplete = true; // Run this code only once

            session.data.reasonCode = reasonCode;
            session.data.reasonText = reasonText;

            // Call UI
            if (session.data.earlyReject != true) {
                /**Do Somthing About Ui */
                // HidePopup();
            }

            // End any child calls
            if (session.data.childsession) {
                try {
                    if (session.data.childsession.status == SIP.Session.C.STATUS_CONFIRMED) {
                        session.data.childsession.bye();
                    } else {
                        session.data.childsession.cancel();
                    }
                } catch (e) { }
            }
            session.data.childsession = null;

            // Mixed Tracks
            if (session.data.AudioSourceTrack && session.data.AudioSourceTrack.kind == "audio") {
                session.data.AudioSourceTrack.stop();
                session.data.AudioSourceTrack = null;
            }
            // Stop any Early Media
            if (session.data.earlyMedia) {
                // session.data.earlyMedia.pause();
                // session.data.earlyMedia.removeAttribute("src");
                // session.data.earlyMedia.load();
                // session.data.earlyMedia = null;
                session.data.earlyMedia.stop()
                session.data.earlyMedia = null
            }
            // Stop any ringing calls
            if (session.data.rinngerObj) {
                // session.data.rinngerObj.pause();
                // session.data.rinngerObj.removeAttribute("src");
                // session.data.rinngerObj.load();
                // session.data.rinngerObj = null;
                session.data.rinngerObj.stop()
                session.data.rinngerObj = null
            }

            // Stop Recording if we are
            // StopRecording(lineObj.LineNumber,true);

            // Audio Meters
            if (lineObj.LocalSoundMeter != null) {
                lineObj.LocalSoundMeter.stop();
                lineObj.LocalSoundMeter = null;
            }
            if (lineObj.RemoteSoundMeter != null) {
                lineObj.RemoteSoundMeter.stop();
                lineObj.RemoteSoundMeter = null;
            }

            // End timers
            window.clearInterval(session.data.videoResampleInterval);
            window.clearInterval(session.data.callTimer);

            if (session.data.earlyReject != true) {
                /**Do Somthing About Ui */
                // UpdateUI();
            }
        },

        /**load audio files */
        preloadAudioFiles() {
            return
            this.audioBlobs.Alert = { file: "Alert.mp3", url: this.hostingPrefex + "/media/Alert.mp3" };
            this.audioBlobs.Ringtone = { file: "Ringtone_1.mp3", url: this.hostingPrefex + "/media/Ringtone_1.mp3" };
            this.audioBlobs.speech_orig = { file: "speech_orig.mp3", url: this.hostingPrefex + "/media/speech_orig.mp3" };
            this.audioBlobs.Busy_UK = { file: "Tone_Busy-UK.mp3", url: this.hostingPrefex + "/media/Tone_Busy-UK.mp3" };
            this.audioBlobs.Busy_US = { file: "Tone_Busy-US.mp3", url: this.hostingPrefex + "/media/Tone_Busy-US.mp3" };
            this.audioBlobs.CallWaiting = { file: "Tone_CallWaiting.mp3", url: this.hostingPrefex + "/media/Tone_CallWaiting.mp3" };
            this.audioBlobs.Congestion_UK = { file: "Tone_Congestion-UK.mp3", url: this.hostingPrefex + "/media/Tone_Congestion-UK.mp3" };
            this.audioBlobs.Congestion_US = { file: "Tone_Congestion-US.mp3", url: this.hostingPrefex + "/media/Tone_Congestion-US.mp3" };
            this.audioBlobs.EarlyMedia_Australia = { file: "Tone_EarlyMedia-Australia.mp3", url: this.hostingPrefex + "/media/Tone_EarlyMedia-Australia.mp3" };
            this.audioBlobs.EarlyMedia_European = { file: "Tone_EarlyMedia-European.mp3", url: this.hostingPrefex + "/media/Tone_EarlyMedia-European.mp3" };
            this.audioBlobs.EarlyMedia_Japan = { file: "Tone_EarlyMedia-Japan.mp3", url: this.hostingPrefex + "/media/Tone_EarlyMedia-Japan.mp3" };
            this.audioBlobs.EarlyMedia_UK = { file: "Tone_EarlyMedia-UK.mp3", url: this.hostingPrefex + "/media/Tone_EarlyMedia-UK.mp3" };
            this.audioBlobs.EarlyMedia_US = { file: "Tone_EarlyMedia-US.mp3", url: this.hostingPrefex + "/media/Tone_EarlyMedia-US.mp3" };

            let ts = this;
            $.each(this.audioBlobs, function (i, item) {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", item.url, true);
                oReq.responseType = "blob";
                oReq.onload = function (oEvent) {
                    var reader = new FileReader();
                    reader.readAsDataURL(oReq.response);
                    reader.onload = function () {
                        item.blob = reader.result;
                    };
                };
                oReq.send();
            });

            // console.log(audioBlobs);
        },

        /**Detect Audio Devices!!!! */
        detectDevices() {
            let ts = this;
            navigator.mediaDevices
                .enumerateDevices()
                .then(function (deviceInfos) {
                    // deviceInfos will not have a populated lable unless to accept the permission
                    // during getUserMedia. This normally happens at startup/setup
                    // so from then on these devices will be with lables.
                    ts.HasAudioDevice = false;
                    ts.HasSpeakerDevice = false; // Safari and Firefox don't have these
                    ts.AudioinputDevices = [];
                    ts.SpeakerDevices = [];
                    for (var i = 0;i < deviceInfos.length;++i) {
                        if (deviceInfos[i].kind === "audioinput") {
                            ts.HasAudioDevice = true;
                            ts.AudioinputDevices.push(deviceInfos[i]);
                        } else if (deviceInfos[i].kind === "audiooutput") {
                            ts.HasSpeakerDevice = true;
                            ts.SpeakerDevices.push(deviceInfos[i]);
                        }
                    }
                })
                .catch(function (e) {
                    console.error("Error enumerating devices", e);
                });
        },

        /**Get Audio Source */
        getAudioSrcID() {
            return "default";
        },

        /**Get Output audio */
        getAudioOutputID() {
            return "default";
        },

        /**ret RingTone Id */
        getRingerOutputID() {
            return "default";
        },

        formatShortDuration(seconds) {
            var sec = Math.floor(parseFloat(seconds));
            if (sec < 0) {
                return sec;
            } else if (sec >= 0 && sec < 60) {
                return "00:" + (sec > 9 ? sec : "0" + sec);
            } else if (sec >= 60 && sec < 60 * 60) {
                // greater then a minute and less then an hour
                var duration = moment.duration(sec, "seconds");
                return (duration.minutes() > 9 ? duration.minutes() : "0" + duration.minutes()) + ":" + (duration.seconds() > 9 ? duration.seconds() : "0" + duration.seconds());
            } else if (sec >= 60 * 60 && sec < 24 * 60 * 60) {
                // greater than an hour and less then a day
                var duration = moment.duration(sec, "seconds");
                return (duration.hours() > 9 ? duration.hours() : "0" + duration.hours()) + ":" + (duration.minutes() > 9 ? duration.minutes() : "0" + duration.minutes()) + ":" + (duration.seconds() > 9 ? duration.seconds() : "0" + duration.seconds());
            }
            //  Otherwise.. this is just too long
        },

        // Inbound Calls
        // =============
        receiveCall(session) {
            let ts = this
            
            var callerID = session.remoteIdentity.displayName
            var did = session.remoteIdentity.uri.user
            let lineObj = { SipSession: session }
            lineObj.SipSession = session
            console.log("New Incoming Call!", callerID + " <" + did + ">")

            /**show browser notify */
            ts.browserNotify(callerID, did)

            /** change appereance buttons */
            ts.changeButtons('incoming')

            // Wire up early session events
            // Inbound You or They Rejected (Does not apply)
            session.on("rejected", function (response, cause) {
                console.log("Call rejected: " + cause);
                // ts.$notify({
                //   text : "call Rejected",
                //   type : "info",
                //   group: "registerInfo"
                // })

                /**call done make buttons ready */
                ts.changeButtons('ready')

                /**change status */
                ts.status.description = 'Ready'
                ts.statusLabel = "Ready"

                /**terminate session */
                ts.teardownSession(lineObj, response.status_code, cause)
            })

            // They cancelled (Gets called regardless)
            session.on("terminated", function (response, cause) {
                // ts.$notify({
                //   text : "They Canceled The Call!",
                //   type : "info",
                //   group: "registerInfo"
                // })

                /**call done make buttons ready */
                ts.changeButtons('ready')

                /**change status */
                ts.status.description = 'Ready'
                ts.statusLabel = "Ready"
                console.warn("terminated called from ReceiveCall(), probably they cancelled", cause)

                /**terminate session */
                ts.teardownSession(lineObj, 0, "Call Cancelled");
            })

            // Time Stamp
            window.clearInterval(lineObj.SipSession.data.callTimer)
            var startTime = moment.utc()
            lineObj.SipSession.data.callstart = startTime.format("YYYY-MM-DD HH:mm:ss UTC")
            lineObj.SipSession.data.callTimer = window.setInterval(function () {
                var now = moment.utc();
                var duration = moment.duration(now.diff(startTime));
                // ts.$notify({
                //   text : ts.formatShortDuration(duration.asSeconds()),
                //   type : "info",
                //   group: "registerInfo"
                // })
                /**
                 * it will calculate time from call invited!
                 */
            }, 1000)
            lineObj.SipSession.data.calldirection = "inbound"
            lineObj.SipSession.data.terminateby = "them" // The lack of any direct action from us leave this settings to be them by default.
            lineObj.SipSession.data.withvideo = false
            var videoInvite = false

            // Auto Answer options
            var autoAnswerRequested = false
            var answerTimeout = 1000

            // Show notification
            // =================

            // Play Ring Tone
            console.log("Audio Playing...")
            Ringtone.play()

            // var rinnger = new Audio(ts.audioBlobs.Ringtone.blob)
            // rinnger.preload = "auto"
            // rinnger.loop = true
            // rinnger
            //   .play()
            //   .then(function () {
            //     // Audio Is Playing
            //   })
            //   .catch(function (e) {
            //     console.warn("Unable to play audio file.", e)
            //   })
            // rinnger.oncanplaythrough = function (e) {
            //   if (typeof rinnger.sinkId !== "undefined" && ts.getRingerOutputID() != "default") {
            //     rinnger
            //       .setSinkId(ts.getRingerOutputID())
            //       .then(function () {
            //         console.log("Set sinkId to:", ts.getRingerOutputID());
            //       })
            //       .catch(function (e) {
            //         console.warn("Failed not apply setSinkId.", e);
            //       });
            //   }
            //   // If there has been no interaction with the page at all... this page will not work
            //   rinnger
            //     .play()
            //     .then(function () {
            //       // Audio Is Playing
            //     })
            //     .catch(function (e) {
            //       console.warn("Unable to play audio file.", e);
            //     });
            // }
            lineObj.SipSession.data.rinngerObj = Ringtone
            session = lineObj.SipSession
        },

        /**
         * answer the call
         */
        answerAudioCall(lineNumber) {

            /** make this inastance */
            let ts = this

            if (!ts.session) {
                console.warn("Failed to get line (" + lineNumber + ")")
                return;
            }
            var session = ts.session
            // Stop the ringtone
            if (session.data.rinngerObj) {
                // session.data.rinngerObj.pause();
                // session.data.rinngerObj.removeAttribute("src");
                // session.data.rinngerObj.load();
                // session.data.rinngerObj = null;
                session.data.rinngerObj.stop()
                session.data.rinngerObj = null
            }
            // Check vitals
            if (ts.HasAudioDevice == false) {
                ts.$notify({
                    text: "no microphone Found! Call Failed!",
                    type: "error",
                });
                return;
            }

            // Start SIP handling
            var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
            var spdOptions = {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: "default" },
                        video: false,
                    },
                },
            }

            // Configure Audio
            var currentAudioDevice = ts.getAudioSrcID();
            if (currentAudioDevice != "default") {
                var confirmedAudioDevice = false;
                for (var i = 0;i < ts.AudioinputDevices.length;++i) {
                    if (currentAudioDevice == AudioinputDevices[i].deviceId) {
                        confirmedAudioDevice = true;
                        break;
                    }
                }
                if (confirmedAudioDevice) {
                    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = { exact: currentAudioDevice };
                } else {
                    console.warn("The audio device you used before is no longer available, default settings applied.");
                }
            }
            // Add additional Constraints
            if (supportedConstraints.autoGainControl) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl = ts.AutoGainControl;
            }
            if (supportedConstraints.echoCancellation) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation = ts.EchoCancellation;
            }
            if (supportedConstraints.noiseSuppression) {
                spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression = ts.NoiseSuppression;
            }

            // Send Answer
            // If this fails, it must still wireup the call so we can manually close it
            try {
                session.accept(spdOptions)

                // Wire up UI
                // ts.$notify({
                //   text: "Call in Progress!",
                //   type: "info",
                //   group: "registerInfo"
                // })
                ts.wireupAudioSession({ SipSession: session })
            } catch (e) {
                console.warn("Failed to answer call", e, session)
                ts.teardownSession({ SipSession: session }, 500, "Client Error")
            }
        },

        /**================= APEREANCE NOTIFICATIONS====================== */
        showRegisterInfo() {
            this.notificationDuration = 70000;
            let text = "<div class='notif'><span class='title'>Registered</span><span class='text'>SIP : " + this.SipUsername + " <br> " + this.profileName + "</span></div>";
            this.$notify({
                text: text,
                type: "info",
                group: "registerInfo",
            });
        },

        /**Press The Key */
        keyPress(key) {
            if (this.dialledNumberFocuse) return;

            if (key == "Backspace") {
                let temp = this.dialledNumber;
                temp = String(temp);
                temp = temp.substring(0, temp.length - 1);
                this.dialledNumber = temp;
                return;
            }

            this.dialledNumber += String(key);
        },

        makeKeysFalse() {
            for (let i;i <= this.key.length;i++) {
                this.key[i] = false;
            }
        },

        /**show browser notifications
         * @param string callerId
         * @param string did
         * @return show browser native notification
         */
        browserNotify(callerId = 'some', did = 'some') {
            let ts = this
            ts.$notification.show('Webphone Ringing...', {
                body: 'New Call From ' + callerId + ' <' + did + '>',
            }, {})
            return
            const notification = {
                title: 'Webphone Ringing...',
                options: {
                    body: 'Tis is an examphle!',
                },
                events: {
                    onerror: function () {
                        console.log('Custom error event was called');
                    },
                    onclick: function () {
                        console.log('Custom click event was called');
                    },
                    onclose: function () {
                        console.log('Custom close event was called');
                    },
                    onshow: function () {
                        console.log('Custom show event was called');
                    }
                }
            }
            this.$notification.show(notification.title, notification.options, notification.events)
        },

        /**
         * change buttons appereance
         * base on session status we change the buttons
         * @param string to the status we have to change
         * the to param can be 
         *  ready , outgoing , incoming , inprogress
         */
        changeButtons(to) {
            switch (to) {
                case 'ready':
                    this.readyButtons = true
                    this.outgoinButtons = false
                    this.incomingcallButtons = false
                    this.callInProgressButtons = false
                    break;
                case 'outgoing':
                    this.readyButtons = false
                    this.outgoinButtons = true
                    this.incomingcallButtons = false
                    this.callInProgressButtons = false
                    break;
                case 'incoming':
                    this.readyButtons = false
                    this.outgoinButtons = false
                    this.incomingcallButtons = true
                    this.callInProgressButtons = false
                    break;
                case 'inprogress':
                    this.readyButtons = false
                    this.outgoinButtons = false
                    this.incomingcallButtons = false
                    this.callInProgressButtons = true
                    break;
                default:
                    break;
            }
        }
    },
    async mounted() {
        /**get User Information */
        await this.getUserInformation()

        /**detect Audio Devices!!! */
        this.detectDevices()

        /**make UserAgent! */
        this.createUserAgent()

        /**make call on enter key press */
        let ts = this
        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                if (!ts.session) {
                    /**no call exists */
                    ts.audioCall()
                } else {
                    /**call exists reject or by or terminate */
                    ts.cancelRejectBy()
                }
            }
        })

    },
    created() {
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "Backspace":
                    this.key[Number(e.key)] = true
                    setTimeout(function () {
                        this.key[Number(e.key)] = false
                    }, 200)
                    this.keyPress(e.key);
                    break;
                default:
                    break;
            }
        });
    },
    components: {
        MaskedInput,
        BeatLoader,
        'nprogress-container': NprogressContainer
    },
    computed: {
        /**
         * we should do somthing when session status changed!
         */
        sessionStatus() {
            if (!this.session) return null
            return this.session.status
            switch (this.session.status) {
                case 2:
                    /**phone ringing... otherSide
                     * this is outgoing call and we should cancel it */
                    this.cancelSession()
                    break
                case 4:
                    /**our phone ringing... 
                     * its incoming call... we can reject or answer */
                    break

                case 9:
                    /*CAll Ended , Ready Mode */
                    break
                case 12:
                    /*call is in progress , end the call */
                    this.byeSession()
                    break

                default:
                    break;
            }
        },

    },
    watch: {
        /**
         * we should do somthing when session status changed!
         * somthing like change appereance!
         */
        session() {
            if (!this.session) return
            switch (this.session.status) {
                case 2:
                    /**phone ringing... otherSide
                     * this is outgoing call and we can cancel it */

                    break
                case 4:
                    /**our phone ringing... 
                     * its incoming call... we can reject or answer */
                    this.status.description = "Incoming Call " + this.session.remoteIdentity.displayName + "<" + this.session.remoteIdentity.uri.user + ">"
                    this.statusLabel = "Incoming Call " + this.session.remoteIdentity.displayName + "<" + this.session.remoteIdentity.uri.user + ">"
                    break
                case 9 || '9':
                    /*CAll Ended , or rejected or everything like that and we reach in , Ready Mode */
                    break
                case 12:
                    /*call is in progress , end the call */
                    /**do nothing yet */
                    break
                default:
                    break
            }
        }
    }
})