import {
    CURRENT_ACTIVE_GROUP,
    FETCH_GROUP_MESSAGES,
    INIT_WS_CONNECTION, SEND_GROUP_MESSAGE,
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

export const updateGroupsOnMessage = (groupUrl, groups) => (dispatch) => {
    // console.log(groupUrl)
    // console.log(groups)
    // let groupToPlaceInFirstPosition = groups.findIndex(elt => elt.url === groupUrl);
    // console.log(groupToPlaceInFirstPosition)
    // if (groupToPlaceInFirstPosition === 0) {
    //     return
    // }
    // let groupsArray = [...groups];
    // let item = {...groupsArray[groupToPlaceInFirstPosition]};
    // groupsArray.splice(groupToPlaceInFirstPosition, 1);
    // groupsArray.unshift(item);
    // console.log(groupsArray);
    // dispatch({
    //     type: SET_WS_GROUPS,
    //     payload: groupsArray
    // })
}
