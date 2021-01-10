import {Client} from "@stomp/stompjs";

let client

const WS_URL = process.env.NODE_ENV === "development" ? "localhost:9090/" : "192.168.1.2:9090/";

export function initWebSocket(userToken) {
    client = new Client({
        brokerURL: "ws://" + WS_URL + "messenger/websocket?token=" + userToken,
        // Uncomment lines to activate WS debug

        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });
    return client
}