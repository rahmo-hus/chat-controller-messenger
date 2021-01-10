import {
    FETCH_GROUP_MESSAGES, HANDLE_RTC_OFFER, HANDLE_RTC_ACTIONS,
    INIT_WS_CONNECTION,
    SET_CHAT_HISTORY,
    SET_WS_GROUPS, HANDLE_RTC_ANSWER, SEND_TO_SERVER, SEND_GROUP_MESSAGE, ADD_CHAT_HISTORY
} from "../utils/redux-constants";
import {wsHealthCheckConnected} from "../actions/webSocketActions";
import {handleRTCActions, handleRTCSubscribeEvents} from "./webRTC-middleware";


function initWsAndSubscribe(wsClient, store, wsUserTokenValue) {
    const groupUrl = localStorage.getItem("_cAG");
    const userId = store.getState().AuthReducer.userId;

    wsClient.onConnect = () => {
        store.dispatch(store.dispatch(wsHealthCheckConnected(true)))

        wsClient.subscribe("/user/queue/reply", (res) => {
            const data = JSON.parse(res.body)
            // retrieveUserData(res);
            store.dispatch({
                type: SET_WS_GROUPS,
                payload: data.groupSet
            });
        })

        wsClient.subscribe("/topic/notification/" + userId, (res) => {
            console.log("RECEIVEING NOTIFICATION")
            updateLastMessageInGroups(store, JSON.parse(res.body));
        })

        wsClient.subscribe("/topic/call/reply/" + groupUrl, (res) => {
            const data = JSON.parse(res.body);
            handleRTCSubscribeEvents(data, store);
        });

        wsClient.publish({destination: "/app/message", body: wsUserTokenValue});
        console.log("On récupère les messages du groupe actif")
        store.dispatch({
            type: FETCH_GROUP_MESSAGES,
            payload: localStorage.getItem("_cAG")
        })
    }

    wsClient.onWebSocketClose = () => {
        console.log("ERROR DURING HANDSHAKE WITH SERVER")
        store.dispatch(wsHealthCheckConnected(false))
    }
    wsClient.activate();
}

const WsClientMiddleWare = () => {
    let wsClient = null;

    return store => next => action => {
        const groupUrl = localStorage.getItem("_cAG")
        const userId = store.getState().AuthReducer.userId;
        switch (action.type) {
            case INIT_WS_CONNECTION:
                // console.log("Starting WS stomp")
                if (action.payload === null) {
                    return next(action);
                }
                wsClient = action.payload.stomp;
                const wsUserTokenValue = action.payload.token;
                initWsAndSubscribe(wsClient, store, wsUserTokenValue);
                break;
            case FETCH_GROUP_MESSAGES:
                // console.log(groupUrl)

                if (wsClient !== null) {
                    wsClient.subscribe("/app/groups/get/" + groupUrl, (res) => {
                        const data = JSON.parse(res.body);
                        console.log(data)
                        store.dispatch({type: SET_CHAT_HISTORY, payload: data})
                    });

                    wsClient.subscribe("/topic/" + groupUrl, (res) => {
                        const data = JSON.parse(res.body);
                        console.log(data)
                        store.dispatch({type: ADD_CHAT_HISTORY, payload: data})
                    });
                }
                break;
            case SEND_GROUP_MESSAGE:
                if (wsClient !== null) {
                    wsClient.publish({
                        destination: "/app/message/text/" + userId + "/group/" + groupUrl,
                        body: JSON.stringify(action.payload)
                    });
                }
                break;
            case HANDLE_RTC_ACTIONS:
                handleRTCActions(wsClient, store, action.payload);
                break;
            case HANDLE_RTC_OFFER:
                console.log("Create offer ...")
                handleRTCActions(wsClient, store, action.payload);
                break;
            case HANDLE_RTC_ANSWER:
                console.log("Create answer ...")
                handleRTCActions(wsClient, store, action.payload);
                break;
            case SEND_TO_SERVER:
                handleRTCActions(wsClient, store, action.payload);
                break;
            default:
                return next(action);
        }
    };
};


/**
 * Update groups sidebar with new messages
 * @param store
 * @param value
 */
function updateLastMessageInGroups(store, value) {
    const groups = store.getState().WebSocketReducer.wsUserGroups;
    let groupToUpdateIndex = groups.findIndex(elt => elt.id === value.groupId)
    let groupsArray = [...groups];
    let item = {...groupsArray[groupToUpdateIndex]};
    item.lastMessage = value.message;
    item.lastMessageDate = value.lastMessageDate;
    item.lastMessageSeen = true;
    groupsArray[groupToUpdateIndex] = item;
    store.dispatch({type: SET_WS_GROUPS, payload: groupsArray})
    // this.setState({groups: groupsArray}, () => {
    //     playNotificationSound();
    // });
}

export default WsClientMiddleWare();