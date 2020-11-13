import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MessageModel from "../../model/message-model";
import {withRouter} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

class WebSocketContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            history: [],
            historySubscriptionId: null,
            groupTopicSubscriptionId: null,
            groupId: null,
            groupUrl: null,
            client: null,
            ws: null
        };
        this.typingMessage = this.typingMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        // this.fetchAllMessages = this.fetchAllMessages.bind(this);
    }

    typingMessage(event) {
        event.preventDefault();
        this.setState({message: event.target.value});
    }

    sendMessage() {
        const userId = this.props.location.userId ? this.props.location.userId : this.props.userId ? this.props.userId : null;
        if (userId === null || undefined) {
            console.warn("userId is null !")
        }
        if (this.props.location.groupUrl === null) {
            console.warn("groupId is null !")
        }
        const toSend = new MessageModel(userId, this.props.location.groupId, this.state.message)
        this.props.ws.publish({
            destination: "/app/message/" + userId + "/group/" + this.props.location.groupUrl,
            body: JSON.stringify(toSend)
        });
        this.setState({message: ""})
    }

    submitMessage(event) {
        if (this.state.message !== "") {
            if (event.key === undefined || event.key === 'Enter') {
                this.sendMessage();
            }
        }
    }

    receiveMessage(payload) {
        this.setState(prevState => ({
            history: [...prevState.history, JSON.parse(payload)]
        }), () => {
            this.scrollToEnd();
        });
    }

    scrollToEnd() {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    launchSubscribe() {
        this.setState({history: []});
        if (this.state.historySubscriptionId) {
            this.props.ws.unsubscribe(this.state.historySubscriptionId);
            // console.log("UNSUBSCRIBE HISTORY");
        }
        if (this.state.groupTopicSubscriptionId) {
            // console.log("UNSUBSCRIBE TOPIC");
            this.props.ws.unsubscribe(this.state.groupTopicSubscriptionId);
        }
        const groupUrl = this.props.location.pathname.split("/").slice(-1)[0];
        let subscribeToHistory = this.props.ws.subscribe("/app/groups/get/" + groupUrl, (res) => {
            this.setState({history: JSON.parse(res.body), historySubscriptionId: subscribeToHistory.id}, () => {
                this.messagesEnd.scrollIntoView({block: "start", behavior: "auto"});
            })
        });
        let subscribeToGroupTopic = this.props.ws.subscribe("/topic/" + this.props.location.groupUrl, (res) => {
            this.receiveMessage(res.body);
        });
        this.setState({groupTopicSubscriptionId: subscribeToGroupTopic.id});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activate !== this.props.activate) {
            this.launchSubscribe();
            this.messagesEnd.scrollIntoView({block: "start", behavior: "smooth"});
        }
    }

    styleSelectedMessage() {
        return this.props.isDarkModeEnable ? "hover-msg-dark" : "hover-msg-light";
    }

    render() {
        return (
            <div style={{display: "flex", flex: "1", flexDirection: "column"}}>
                <div style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "calc(100% - 56px)",
                    overflowY: "scroll"
                }}>
                    {this.state.history && this.state.history.map((val, index, array) => (
                        <Tooltip
                            key={index}
                            enterDelay={700}
                            leaveDelay={0}
                            title={new Date(val.time).getHours() + ":" + new Date(val.time).getMinutes()}
                            placement="left">
                            <div className={'msg ' + this.styleSelectedMessage()} key={index}
                                 style={{display: "flex", alignItems: "center"}}>
                                {index >= 1 && array[index - 1].userId === array[index].userId ?
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                    }}/>
                                    :
                                    <div style={{
                                        fontFamily: "Segoe UI,SegoeUI,\"Helvetica Neue\",Helvetica,Arial,sans-serif",
                                        backgroundColor: `${val.color}`,
                                        letterSpacing: "1px",
                                        width: "40px",
                                        height: "40px",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        borderRadius: " 50%",
                                        lineHeight: "37px"
                                    }}>
                                        <div style={{color: "#FFFFFF"}}>{val.initials}</div>
                                    </div>
                                }
                                <div style={{margin: "4px"}}>
                                    {index >= 1 && array[index - 1].userId === array[index].userId ?
                                        <div/>
                                        :
                                        <div>
                                            <b>{val.sender} </b>
                                        </div>
                                    }
                                    <div>{val.message}</div>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                    <div style={{float: "left", clear: "both"}}
                         ref={(el) => {
                             this.messagesEnd = el;
                         }}>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    position: "relative",
                    bottom: "0",
                    padding: "5px"
                }}>
                    <TextField
                        variant="outlined"
                        onChange={(e) => this.typingMessage(e)}
                        onKeyDown={(event) => this.submitMessage(event)}
                        margin="normal"
                        id="message"
                        label="Your message"
                        name="message"
                        value={this.state.message}
                        autoFocus
                        style={{width: "90%"}}
                    />
                    <Button
                        onClick={this.sendMessage}
                        variant="contained"
                        color="primary"
                        style={{
                            marginLeft: "3px",
                            maxWidth: "20px"
                        }}
                        disabled={this.state.message === ""}
                    >
                        <DoubleArrowIcon/>
                    </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(WebSocketContainer);
