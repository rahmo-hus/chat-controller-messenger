import {connect} from 'react-redux'
import {WebsocketGroupsComponent} from "../../components/websocket/websocket-groups-component";
import {setCurrentActiveGroup} from "../../actions/webSocketActions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isWsConnected, wsUserGroups,currentActiveGroup} = state.WebSocketReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        isWsConnected,
        currentActiveGroup,
        wsUserGroups
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentActiveGroup: (bool) => dispatch(setCurrentActiveGroup(bool)),
    }
}


const WebSocketGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(WebsocketGroupsComponent);

export default WebSocketGroupsContainer;