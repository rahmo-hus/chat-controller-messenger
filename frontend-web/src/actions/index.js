import {
    CHANGE_THEME_MODE,
    DARK_MODE_ENABLED,
    INIT_WS_TOKEN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    USER_LOGOUT
} from "../utils/redux-constants";
import "./webSocketActions";
import AuthService from "../service/auth-service";

export const changeThemeMode = () => ({
    type: DARK_MODE_ENABLED
})

export const changeCurrentThemeMode = () => ({
    type: CHANGE_THEME_MODE,
})

export const setWsUserToken = (token) => ({
    type: INIT_WS_TOKEN,
    payload: token
})

export const userAuthenticated = (data) => ({
    type: LOGIN_SUCCESS,
    payload: {
        username: data.firstName,
        userId: data.id
    }
})

export const initUserData = () => (dispatch) => {
    return AuthService.testRoute().then(
        (res) => {
            // localStorage.setItem("_cAG", res.data.groupSet[0].url)
            dispatch(userAuthenticated(res.data))
            dispatch(setWsUserToken(res.data.wsToken))
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

