import React, {useEffect} from "react";
import {generateColorMode, generateIconColorMode} from "../../design/style/enable-dark-mode";
import CallEndRoundedIcon from '@material-ui/icons/CallEndRounded';
import IconButton from "@material-ui/core/IconButton";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import PhoneForwardedRoundedIcon from '@material-ui/icons/PhoneForwardedRounded';

export const CallWindowComponentTRASH = ({
                                             wsUserTokenValue,
                                             initCallWebRTC,
                                             setWsObject,
                                             sendWsData,
                                             isDarkModeToggled
                                         }) => {
    const introMusic = new Audio("/assets/sounds/incoming-call-audio.mp3")
    const [isMicMuted, setMicStatus] = React.useState(false);
    const [isVideoStopped, setVideoState] = React.useState(false);
    const [acceptCall, setAcceptCall] = React.useState(false);

    // useEffect(() => {
    //     console.log(acceptCall)
    //     if (!acceptCall) {
    //         introMusic.play();
    //     } else {
    //         introMusic.pause()
    //         introMusic.currentTime = 0;
    //         console.log(introMusic.paused)
    //     }
    //     console.log(introMusic.paused)
    // }, [acceptCall])


    useEffect(() => {
        console.log(introMusic.paused)
        if (introMusic.paused) {
            introMusic.play().then(r => {
                console.log(r)
            }).catch(r => {
                console.log(r)
            });
        } else {
            introMusic.pause();
        }
    }, [acceptCall])


// useEffect(() => {
//     if (wsUserTokenValue !== null) {
//         console.log("Starting call....")
//         initWs().then(initCallWebRTC({event: "init"}))
//     }
// }, [wsUserTokenValue])
//
// const initWs = () => new Promise(resolve => {
//     const wsClient = initWebSocket(wsUserTokenValue);
//     const toSend = {stomp: wsClient, token: wsUserTokenValue}
//     setWsObject(toSend);
//     resolve();
// })
    function changeMicState(event) {
        event.preventDefault();
        setMicStatus(!isMicMuted)
    }

    async function changeVideoState(event) {
        event.preventDefault();
        await setVideoState(!isVideoStopped)

        if (!isVideoStopped) {
            const vidObject = document.getElementById("local_video").srcObject;
            if (vidObject === null) {
                return
            }
            const tracks = vidObject.getTracks();

            tracks.forEach(function (track) {
                track.stop();
            });

            vidObject.srcObject = null;
        } else {
            getLocalVideo();
        }
    }

    function closeCallWindow() {
        window.close();
    }

    function handleCallResponse(event) {
        event.preventDefault();

        setAcceptCall(!acceptCall)
    }

    function getLocalVideo() {
        navigator.mediaDevices.getUserMedia({audio: true, video: {frameRate: {ideal: 30, max: 60}}})
            .then(function (stream) {
                document.getElementById("local_video").srcObject = stream;
            })
            .catch((err) => {
                console.log(err)
            });
    }


    return (
        <div className={generateColorMode(isDarkModeToggled)}
             style={{width: "100%", height: "100%", textAlign: "center", display: "flex", flexDirection: "column"}}>
            <div>
                <video id="received_video" autoPlay/>
                <video id="local_video" muted autoPlay/>
            </div>
            <div>
                <IconButton onClick={event => closeCallWindow(event)}>
                    <CallEndRoundedIcon
                        className={generateIconColorMode(isDarkModeToggled)}
                        style={{
                            backgroundColor: "#ff00008a",
                            borderRadius: "50%",
                            height: "40px",
                            width: "40px",
                            padding: "4px"
                        }}/>
                </IconButton>

                <IconButton onClick={(event) => handleCallResponse(event)}>
                    <PhoneForwardedRoundedIcon
                        className={generateIconColorMode(isDarkModeToggled)}
                        style={{
                            backgroundColor: "#ff00008a",
                            borderRadius: "50%",
                            height: "40px",
                            width: "40px",
                            padding: "4px"
                        }}/>
                </IconButton>

                <IconButton onClick={event => changeMicState(event)}>
                    {
                        isMicMuted ?
                            <MicOffIcon
                                className={generateIconColorMode(isDarkModeToggled)}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.54)",
                                    borderRadius: "50%",
                                    height: "40px",
                                    width: "40px",
                                    padding: "4px"
                                }}/>
                            :
                            <MicIcon
                                className={generateIconColorMode(isDarkModeToggled)}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.54)",
                                    borderRadius: "50%",
                                    height: "40px",
                                    width: "40px",
                                    padding: "4px"
                                }}/>
                    }
                </IconButton>
                <IconButton onClick={event => changeVideoState(event)}>
                    {
                        isVideoStopped ?
                            <VideocamOffIcon
                                className={generateIconColorMode(isDarkModeToggled)}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.54)",
                                    borderRadius: "50%",
                                    height: "40px",
                                    width: "40px",
                                    padding: "4px"
                                }}/>
                            :
                            <VideocamIcon
                                className={generateIconColorMode(isDarkModeToggled)}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.54)",
                                    borderRadius: "50%",
                                    height: "40px",
                                    width: "40px",
                                    padding: "4px"
                                }}/>
                    }
                </IconButton>
            </div>
        </div>
    )
}
