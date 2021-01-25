import {connect} from 'react-redux'
import {setCurrentActiveGroup} from "../../actions/webSocketActions";
import {WebSocketGroupActionComponent} from "../../components/websocket/websocket-group-actions-component";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {userId} = state.AuthReducer;
    const {currentActiveGroup} = state.WebSocketReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        currentActiveGroup,
        userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentActiveGroup: (bool) => dispatch(setCurrentActiveGroup(bool)),
    }
}


const WebSocketGroupsActionContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketGroupActionComponent);

export default WebSocketGroupsActionContainer;