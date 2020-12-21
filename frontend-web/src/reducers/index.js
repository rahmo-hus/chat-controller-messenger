import {combineReducers} from "redux";
import ThemeReducer from "./theme-mode-reducer";
import AuthReducer from "./auth-reducer";
import WebSocketReducer from "./websocket-reducer";

const rootReducer = combineReducers({
    ThemeReducer,
    AuthReducer,
    WebSocketReducer
});

export default rootReducer;