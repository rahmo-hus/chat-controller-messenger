import {connect} from 'react-redux'
import {WebSocketChatComponent} from "../../components/websocket/websocket-chat-component";
import {fetchGroupMessages, sendWsMessage, setCurrentActiveGroup} from "../../actions/webSocketActions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isWsConnected, currentActiveGroup, chatHistory, wsObject} = state.WebSocketReducer;
    const {userId} = state.AuthReducer
    return {
        isDarkModeToggled,
        currentThemeMode,
        currentActiveGroup,
        chatHistory,
        wsObject,
        userId,
        isWsConnected
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchMessages: (groupUrl) => dispatch(fetchGroupMessages(groupUrl)),
        setCurrentActiveGroup: (bool) => dispatch(setCurrentActiveGroup(bool)),
        sendWsMessage: (message) => dispatch(sendWsMessage(message))
    }
}


const WebSocketChatContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketChatComponent);

export default WebSocketChatContainer;