import {connect} from 'react-redux'
import {initWsConnection} from "../actions/webSocketActions";
import {createAnswer, createOffer, sendToServer} from "../actions/webRtcActions";
import {CallWindowComponentTRASH} from "../components/websocket/call-window-componentTRASH";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {userId} = state.AuthReducer;
    const {wsUserTokenValue, isWsConnected} = state.WebSocketReducer;
    const {webRtcOffer, webRtcAnswer, webRtcCandidate} = state.WebRTCReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        wsUserTokenValue,
        isWsConnected,
        webRtcAnswer,
        webRtcCandidate,
        webRtcOffer,
        userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setWsObject: (data) => dispatch(initWsConnection(data)),
        createOffer: (data) => dispatch(createOffer(data)),
        createAnswer: (data) => dispatch(createAnswer(data)),
        sendToServer: (data) => dispatch(sendToServer(data))
    }
}

const CallWindowContainerTRASH = connect(mapStateToProps, mapDispatchToProps)(CallWindowComponentTRASH);

export default CallWindowContainerTRASH;