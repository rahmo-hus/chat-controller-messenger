import {Client} from "@stomp/stompjs";

let client;

const WS_URL = process.env.NODE_ENV === "development" ? window.location.hostname+":9090/" : window.location.hostname+"/";
const BROKER_URL_PREFIX = process.env.NODE_ENV === "development" ? "ws://" : "wss://";
export function initWebSocket(userToken) {
    client = new Client({
        brokerURL: BROKER_URL_PREFIX + WS_URL + "messenger/websocket?token=" + userToken,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });
    return client
}