import {
    CHANGE_THEME_MODE,
    DARK_MODE_ENABLED, INIT_WS_CONNECTION, INIT_WS_TOKEN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS, SET_WS_GROUPS,
    USER_LOGOUT, WS_CHECK_CONNECTED
} from "../utils/redux-constants";
import AuthService from "../service/auth-service";

export const changeThemeMode = () => ({
    type: DARK_MODE_ENABLED
})

export const changeCurrentThemeMode = () => ({
    type: CHANGE_THEME_MODE,
})

export const userAuthenticated = (usernameLoggedIn) => ({
    type: LOGIN_SUCCESS,
    payload: usernameLoggedIn
})

export const initUserData = () => (dispatch) => {
    return AuthService.testRoute().then(
        (res) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data.firstName
            })
            dispatch({
                type: INIT_WS_TOKEN,
                payload: res.data.wsToken
            })
            return Promise.resolve();
        },
        () => {
            dispatch({
                type: LOGIN_FAILURE,
            });
            return Promise.reject();
        }
    );
};

export const userLogout = () => ({
    type: USER_LOGOUT
})

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
