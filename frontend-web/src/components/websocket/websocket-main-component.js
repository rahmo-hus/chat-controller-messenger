import React, {useEffect} from "react";
import {generateColorMode} from "../../design/style/enable-dark-mode";
import WebSocketGroupsContainer from "../../container/websocket/websocket-groups-container";
import WebSocketChatContainer from "../../container/websocket/websocket-chat-container";
import "./websocketStyle.css"
import {initWebSocket} from "../../config/websocket-config";
import WebSocketGroupsActionContainer from "../../container/websocket/websocket-group-actions-container";

export const WebSocketMainComponent = ({
                                           wsUserTokenValue,
                                           isDarkModeToggled,
                                           setWsObject,
                                           wsCheckConnected,
                                           initCallWebRTC,
                                           unsubscribeAll
                                       }) => {

    const groupUrl = localStorage.getItem("_cAG");
    useEffect(() => {
        if (wsUserTokenValue !== null) {
            initWs()
            //     .then(() => {
            //     console.log("initCallWebRTC({event: \"init\"})")
            //     initCallWebRTC({event: "init"})
            // });
        }
        else {
            return () => {
                setWsObject(null);
                wsCheckConnected(false);
                unsubscribeAll()
                console.log("Disconnected")
            }
        }

    }, [wsUserTokenValue])

    async function initWs() {
        const wsClient = await initWebSocket(wsUserTokenValue);
        const toSend = {stomp: wsClient, token: wsUserTokenValue}
        await setWsObject(toSend);
    }

    return (
        <div className={generateColorMode(isDarkModeToggled)}
             style={{height: "calc(100% - 64px)", display: "flex", justifyContent: "space-between"}}>
            <WebSocketGroupsContainer/>
            <WebSocketChatContainer/>
            <WebSocketGroupsActionContainer/>
        </div>
    )
}
