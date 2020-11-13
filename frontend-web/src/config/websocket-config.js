import {Client} from "@stomp/stompjs";
import MessageModel from "../model/message-model";

let client

const WS_URL = process.env.NODE_ENV === "development" ? "localhost:9090/" : "192.168.1.2:9090/";

export function initWebSocket(securedUrl) {
    client = new Client({
        brokerURL: "ws://" + WS_URL + "messenger/websocket?token=" + securedUrl,
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });
    // client.activate();
    return client
}

export function sendMessage(userId, groupUrl, message) {
    const toSend = new MessageModel(userId, groupUrl, message)
    client.publish({
        destination: "/app/message/" + this.props.location.userId + "/group/" + this.state.groupUrl,
        body: JSON.stringify(toSend)
    });
}