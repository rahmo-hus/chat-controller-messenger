import React, {useEffect} from "react";
import {generateColorMode} from "../../design/style/enable-dark-mode";
import {WebSocketChatComponent} from "./websocket-chat-component";
import {WebSocketGroupActionComponent} from "./websocket-group-actions-component";
import {initWebSocket} from "../../config/websocket-config";
import {useHistory} from "react-router-dom";
import WebSocketGroupsContainer from "../../container/websocket-groups-container";

export const WebSocketMainComponent = ({
                                           wsUserTokenValue,
                                           isDarkModeToggled,
                                           isUserLoggedIn,
                                           setWsObject,
                                           wsCheckConnected,
                                           wsUserGroups
                                       }) => {
    const history = useHistory();
    useEffect(() => {
        if (isUserLoggedIn !== null && !isUserLoggedIn) {
            history.push("/");
        }
        if (wsUserTokenValue !== null) {
            init();
        }
        return () => {
            setWsObject(null);
            wsCheckConnected(false);
        }

    }, [wsUserTokenValue])

    function init() {
        if (wsUserTokenValue !== undefined) {
            const server = initWebSocket(wsUserTokenValue);
            const toSend = {wsToken: wsUserTokenValue, wsClient: server}
            setWsObject(toSend);
        }
    }

    return (
        <div className={generateColorMode(isDarkModeToggled)}
             style={{height: "calc(100% - 64px)", display: "flex", justifyContent: "space-between"}}>
            <React.Fragment>
                <WebSocketGroupsContainer/>
                <WebSocketChatComponent/>
                <WebSocketGroupActionComponent/>
            </React.Fragment>
        </div>
    )
}
