import {connect} from 'react-redux'
import {WebSocketChatComponent} from "../../components/websocket/websocket-chat-component";
import {
    fetchGroupMessages, markMessageAsSeen,
    sendWsMessage,
    setCurrentActiveGroup
} from "../../actions/webSocketActions";
import {userLogout} from "../../actions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isWsConnected, currentActiveGroup, chatHistory, wsObject, wsUserGroups} = state.WebSocketReducer;
    const {userId, usernameLoggedIn} = state.AuthReducer
    return {
        isDarkModeToggled,
        currentThemeMode,
        currentActiveGroup,
        chatHistory,
        wsUserGroups,
        wsObject,
        usernameLoggedIn,
        userId,
        isWsConnected
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchMessages: (groupUrl, userId) => dispatch(fetchGroupMessages(groupUrl, userId)),
        setCurrentActiveGroup: (bool) => dispatch(setCurrentActiveGroup(bool)),
        sendWsMessage: (message) => dispatch(sendWsMessage(message)),
        userLogout : () => dispatch(userLogout()),
        markMessageAsSeen: (groupUrl) => dispatch(markMessageAsSeen(groupUrl))
    }
}


const WebSocketChatContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketChatComponent);

export default WebSocketChatContainer;