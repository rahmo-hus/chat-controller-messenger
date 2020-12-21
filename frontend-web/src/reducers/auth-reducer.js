import {LOGIN_FAILURE, LOGIN_SUCCESS, USER_LOGOUT} from "../utils/redux-constants";

const initialState = {
    isUserLoggedIn: null,
    usernameLoggedIn: null
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {isUserLoggedIn: true, usernameLoggedIn: action.payload};
        case LOGIN_FAILURE:
        case USER_LOGOUT:
            return {isUserLoggedIn: false, usernameLoggedIn: null};
        default:
            return state;
    }
}

export default AuthReducer;