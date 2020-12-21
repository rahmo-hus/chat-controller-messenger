import {INIT_WS_CONNECTION, SET_WS_GROUPS} from "../utils/redux-constants";
import {wsHealthCheckConnected} from "../actions";

const WsClientMiddleWare = () => {
    let wsClient = null;

    // const retrieveUserData = store => (data) => {
    //     console.log(data.groupSet)
    //     store.dispatch({
    //         type: SET_WS_GROUPS,
    //         payload: data.groupSet
    //     });
    // };

    // the middleware part of this function
    return store => next => action => {
        switch (action.type) {
            case INIT_WS_CONNECTION:
                if (action.payload === null) {
                    return next(action);
                }
                wsClient = action.payload.wsClient;
                const wsUserTokenValue = action.payload.wsToken;
                wsClient.onConnect = () => {
                    store.dispatch(store.dispatch(wsHealthCheckConnected(true)))
                    console.log("Connected")
                    wsClient.subscribe("/user/queue/reply", (res) => {
                        const data = JSON.parse(res.body)
                        // retrieveUserData(res);
                        store.dispatch({
                            type: SET_WS_GROUPS,
                            payload: data.groupSet
                        });
                    })
                    wsClient.publish({destination: "/app/message", body: wsUserTokenValue});
                }

                wsClient.onWebSocketClose = () => {
                    console.log("ERROR DURING HANDSHAKE WITH SERVER")
                    store.dispatch(wsHealthCheckConnected(false))
                }
                wsClient.activate();
                break;
            default:
                // console.log(action.type)
                return next(action);
        }
    };
};

export default WsClientMiddleWare();