import {INIT_WS_CONNECTION, SET_WS_GROUPS} from "../utils/redux-constants";


const retrieveUserData = store => (data) => {
    console.log(data)
    store.dispatch({
        type: SET_WS_GROUPS,
        payload: data.groupSet
    });
};

/**
 * An example middleware to handle WebSocket connections.
 * NB: There is no exception handling!
 */
export const WebSocketMiddleware = ({dispatch}) => next => action => {
    console.log("Middleware")
    switch (action.type) {
        case INIT_WS_CONNECTION:
            const wsClient = action.payload.wsClient;
            console.log(wsClient)
            const wsUserTokenValue = action.payload.wsToken;
            wsClient.onConnect = () => {
                wsClient.subscribe("/user/queue/reply", (res) => {
                    const data = JSON.parse(res.body);
                    console.log(data)
                    retrieveUserData(data);
                })
                wsClient.publish({destination: "/app/message", body: wsUserTokenValue});
            }
            wsClient.activate();
            break;
        default:
            break;
    }
    return next(action);
};

