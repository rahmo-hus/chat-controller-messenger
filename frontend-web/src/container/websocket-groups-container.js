import {connect} from 'react-redux'
import {WebsocketGroupsComponent} from "../components/websocket/websocket-groups-component";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isWsConnected, wsUserGroups} = state.WebSocketReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        isWsConnected,
        wsUserGroups
    };
}



const WebSocketGroupsContainer = connect(mapStateToProps, null)(WebsocketGroupsComponent);

export default WebSocketGroupsContainer;