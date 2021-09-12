import {connect} from 'react-redux'
import {WebSocketMainComponent} from "../components/websocket/websocket-main-component";
import {initWsConnection, wsHealthCheckConnected} from "../actions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isUserLoggedIn, usernameLoggedIn} = state.AuthReducer;
    const {wsUserTokenValue, wsUserGroups, isWsConnected} = state.WebSocketReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        isUserLoggedIn,
        wsUserTokenValue,
        isWsConnected,
        wsUserGroups,
        usernameLoggedIn
    };
}

const mapDispatchToProps = dispatch => {
    return {
        wsCheckConnected: (bool) => dispatch(wsHealthCheckConnected(bool)),
        setWsObject: (data) => dispatch(initWsConnection(data))
    }
}


const WebSocketMainContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketMainComponent);

export default WebSocketMainContainer;