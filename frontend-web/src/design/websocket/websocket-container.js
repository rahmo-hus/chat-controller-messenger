import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MessageModel from "../../model/message-model";
import AuthService from "../../service/auth-service";
import {withRouter} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import SidebarGroupActions from "./sidebar-group-actions";

class WebSocketContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            history: [],
            groupId: null,
            ws: null
        };
        this.typingMessage = this.typingMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.fetchAllMessages = this.fetchAllMessages.bind(this);
    }

    typingMessage(event) {
        event.preventDefault();
        this.setState({message: event.target.value});
    }

    sendMessage() {
        const temp = this.props.location.userId ? this.props.location.userId : null;
        if (temp === null) {
            console.warn("userId is null !")
        }
        if (this.props.location.groupId === null) {
            console.warn("groupId is null !")
        }
        const toSend = new MessageModel(temp, this.props.location.groupId, this.state.message)
        this.state.ws.send(JSON.stringify(toSend));
        this.setState({message: ""})
    }

    submitMessage(event) {
        if (event.key === undefined || event.key === 'Enter') {
            this.sendMessage();
        }
    }

    fetchAllMessages() {
        const groupUrl = this.props.location.pathname.split("/").slice(-1)[0];
        AuthService.fetchMessages(groupUrl).then(r => {
            if (r.data.length !== 0) {
                this.setState({history: r.data}, () => {
                    console.log(this.state.history)
                });
            }
        })
    }

    receiveMessage(payload) {
        this.setState(prevState => ({
            history: [...prevState.history, JSON.parse(payload.data)]
        }), () => {
            this.messagesEnd.scrollIntoView({behavior: "smooth"});
        });
    }

    connect() {
        const ws = new WebSocket("ws://localhost:9292/ws")
        ws.onopen = () => {
            console.log("Websocket connected");
            this.setState({connected: true});
            this.setState({ws: ws})
        };

        ws.onmessage = (payload) => {
            this.receiveMessage(payload);
        }

        // websocket onclose event listener
        ws.onclose = e => {
            console.log("disconnected ", e.reason)
            this.setState({connected: false})
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(err.message);
            ws.close();
        };
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.connected !== this.state.connected && !this.state.connected) {
        //     setTimeout(() => {
        //         this.connect();
        //     }, 3000)
        // }
        if (prevProps.location.groupId !== this.props.location.groupId) {
            console.log("Changed !")
            this.setState({history: []});
            this.fetchAllMessages();
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.connect();
        this.fetchAllMessages();
    }

    render() {
        return (
            <div>
                <SidebarGroupActions groupUrl={this.props.location.pathname.split("/").slice(-1)[0]}/>
                <div style={{marginRight: "240px", marginLeft: "240px", height: "93%"}}>
                    <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <div style={{backgroundColor: "#e3e3e3", width: "100%", overflowY: "scroll", height: "84vh"}}>
                            {this.state.history && this.state.history.map((val, index, array) => (
                                <Tooltip
                                    key={index}
                                    title={new Date(val.time).getHours() + ":" + new Date(val.time).getMinutes()}
                                    placement="left">
                                    <div className={"msg"} key={index} style={{display: "flex", alignItems: "center"}}>
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
                            bottom: "0"
                        }}>
                            <TextField
                                variant="outlined"
                                onChange={(e) => this.typingMessage(e)}
                                onKeyDown={(event) => this.submitMessage(event)}
                                margin="normal"
                                fullWidth
                                id="message"
                                label="Your message"
                                name="message"
                                value={this.state.message}
                                autoFocus
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
                                >>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(WebSocketContainer);
