import {connect} from 'react-redux'
import {WebSocketMainComponent} from "../../components/websocket/websocket-main-component";
import {initWsConnection, setCurrentActiveGroup, wsHealthCheckConnected} from "../../actions/webSocketActions";
import {initCallWebRTC} from "../../actions/webRtcActions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isUserLoggedIn} = state.AuthReducer;
    const {wsUserTokenValue, wsUserGroups, isWsConnected, currentActiveGroup} = state.WebSocketReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        isUserLoggedIn,
        wsUserTokenValue,
        isWsConnected,
        currentActiveGroup,
        wsUserGroups
    };
}

const mapDispatchToProps = dispatch => {
    return {
        wsCheckConnected: (bool) => dispatch(wsHealthCheckConnected(bool)),
        setCurrentActiveGroup: (url) => dispatch(setCurrentActiveGroup(url)),
        setWsObject: (data) => dispatch(initWsConnection(data)),
        initCallWebRTC: (data) => dispatch(initCallWebRTC(data))
    }
}


const WebSocketMainContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketMainComponent);

export default WebSocketMainContainer;