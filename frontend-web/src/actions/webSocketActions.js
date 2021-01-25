import {
    CURRENT_ACTIVE_GROUP,
    FETCH_GROUP_MESSAGES,
    INIT_WS_CONNECTION, MARK_MESSAGE_AS_SEEN, SEND_GROUP_MESSAGE,
    SET_WS_GROUPS, UNSUBSCRIBE_ALL, WS_CHECK_CONNECTED
} from "../utils/redux-constants";

export const initWsConnection = (client) => ({
    type: INIT_WS_CONNECTION,
    payload: client
})

export const wsHealthCheckConnected = (bool) => ({
    type: WS_CHECK_CONNECTED,
    payload: bool
})

export const setWsUserGroups = (groupsArray) => ({
    type: SET_WS_GROUPS,
    payload: groupsArray
})

export const setCurrentActiveGroup = (groupUrl) => ({
    type: CURRENT_ACTIVE_GROUP,
    payload: groupUrl
})

export const fetchGroupMessages = (groupUrl) => ({
    type: FETCH_GROUP_MESSAGES,
    payload: groupUrl
})

export const sendWsMessage = (message) => ({
    type: SEND_GROUP_MESSAGE,
    payload: message
})

export const unsubscribeAll = () => ({
    type: UNSUBSCRIBE_ALL
})

export const markMessageAsSeen = (groupUrl) => ({
    type: MARK_MESSAGE_AS_SEEN,
    payload: groupUrl
})
