import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import MessageModel from "../../model/message-model";
import {withRouter} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {MessageTypeEnum} from "../../utils/type-message-enum";
import CustomTextField from "../partials/custom-material-textfield";
import AuthService from "../../service/auth-service";

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
            ws: null,

            file: "",
            imagePreviewUrl: "",
            binaryData: null,
            imageLoaded: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.resetImageBuffer = this.resetImageBuffer.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({message: event.target.value});
    }

    sendMessage() {
        const userId = this.props.location.userId ? this.props.location.userId : this.props.userId ? this.props.userId : null;
        if (userId === null || undefined) {
            console.warn("userId is null !")
        }
        if (this.props.location.groupUrl === undefined) {
            console.warn("groupId is null !")
        }
        if (this.state.message !== "") {
            // console.log("Publishing text");
            this.props.updateGroupWhenUserSendMessage(this.props.location.groupUrl, this.state.message, MessageTypeEnum.text);
            const toSend = new MessageModel(userId, this.props.location.groupId, this.state.message)
            this.props.ws.publish({
                destination: "/app/message/text/" + userId + "/group/" + this.props.location.groupUrl,
                body: JSON.stringify(toSend)
            });
        }
        if (this.state.file !== "") {
            // console.log("Publishing file");
            const formData = new FormData();
            formData.append("file", this.state.file)
            formData.append("userId", this.props.userId)
            formData.append("groupUrl", this.props.groupUrl)
            formData.append("extension", ".jpg")
            AuthService.uploadFile(formData).then(r => {
                // console.log(r.data)
            })
            this.props.updateGroupWhenUserSendMessage(this.props.location.groupId, this.state.message, MessageTypeEnum.image);
            // this.props.ws.publish({
            //     destination: "/app/message/blob/" + userId + "/group/" + this.props.location.groupUrl,
            //     binaryBody: this.state.binaryData,
            //     headers: {'content-type': 'application/octet-stream'}
            // });
        }
        this.props.updateGroupsArrayOnMessage(this.props.location.groupUrl);
        this.setState({message: "", file: "", imagePreviewUrl: "", imageLoaded: false})
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
            console.log(res.body)
            this.setState({history: JSON.parse(res.body), historySubscriptionId: subscribeToHistory.id}, () => {
                this.messagesEnd.scrollIntoView({block: "start", behavior: "auto"});
            })
        });
        let subscribeToGroupTopic = this.props.ws.subscribe("/topic/" + this.props.location.groupUrl, (res) => {
            this.receiveMessage(res.body);
        });
        this.setState({groupTopicSubscriptionId: subscribeToGroupTopic.id});
    }


    styleSelectedMessage() {
        return this.props.isDarkModeEnable ? "hover-msg-dark" : "hover-msg-light";
    }

    previewFile(event) {
        this.resetImageBuffer(event);
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.readAsDataURL(file)
        // reader.readAsArrayBuffer(file);
        // reader.onloadend = (evt) => {
        //     if (evt.target.readyState === FileReader.DONE) {
        //         let arrayBuffer = evt.target.result;
        //         let array = new Uint8Array(arrayBuffer);
        //         for (let i = 0; i < array.length; i) {
        //             fileByteArray.push(array[i]);
        //         }
        //     }
        //     this.setState({binaryData: fileByteArray}, () => {
        //         console.log(this.state.binaryData)
        //     });
        // }

        reader.onload = (e) => {
            if (e.target.readyState === FileReader.DONE) {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result,
                    imageLoaded: true
                });
            }
        };
    }

    generateImageRender(message) {
        const data = JSON.parse(message);
        console.log(data.url)
        if (data.url === undefined) {
            return null;
        }
        return <img src={"http://localhost:9090/images" + data.url} height={"200px"} alt={data.name}
                    style={{border: "1px solid #c8c8c8", borderRadius: "8%"}}/>
    }

    resetImageBuffer(event) {
        event.preventDefault();
        this.setState({file: "", imagePreviewUrl: "", imageLoaded: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activate !== this.props.activate) {
            this.launchSubscribe();
            this.messagesEnd.scrollIntoView({block: "start", behavior: "smooth"});
        }
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
                                    {
                                        val.type === "TEXT" ?
                                            <div>
                                                {val.message}
                                            </div>
                                            :
                                            <div>
                                                {this.generateImageRender(val.message)}
                                            </div>
                                    }
                                    {/*<div>{val.message}</div>*/}
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
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                        {
                            this.state.imagePreviewUrl &&
                            <div style={{
                                padding: "10px",
                                height: "120px",
                                maxWidth: "120px",
                                background: "url('" + this.state.imagePreviewUrl + "')",
                                backgroundSize: "cover",
                                position: "relative",
                                borderRadius: "10%"
                            }}>
                                {/*<img src={this.state.imagePreviewUrl} alt={"whu"}/>*/}
                                <IconButton style={{
                                    height: "20px",
                                    position: "absolute",
                                    right: " 8px",
                                    top: "8px",
                                    width: "20px"
                                }}
                                            onClick={event => this.resetImageBuffer(event)}>
                                    <HighlightOffIcon/>
                                </IconButton>
                            </div>
                        }
                    </div>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        position: "relative",
                        bottom: "0",
                        padding: "5px"
                    }}>
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={event => this.previewFile(event)}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="text" component="span">
                                <ImageIcon/>
                            </Button>
                        </label>
                        {/*/!*<img className=" _52mr _1byr _5pf5 img" alt=""*!/*/}
                        {/*     // src="https://scontent-cdt1-1.xx.fbcdn.net/v/t1.15752-9/124549630_1284129615257188_6846457052693633130_n.png?_nc_cat=109&amp;ccb=2&amp;_nc_sid=ae9488&amp;_nc_ohc=RKFQ99KkdwMAX8e8y1d&amp;_nc_ht=scontent-cdt1-1.xx&amp;oh=2f117e0013acf9ee00c6fb9d1fdbf282&amp;oe=5FD7DBFB"*/}
                        {/*     // style="max-width: 100%; width: 100%;">*/}
                        <CustomTextField
                            id={"inputChatMessenger"}
                            label={"Write a message"}
                            value={this.state.message}
                            handleChange={this.handleChange}
                            type={"text"}
                            keyUp={this.submitMessage}
                            isDarkModeEnable={this.props.isDarkModeEnable}
                        />
                        {/*<TextField*/}
                        {/*    id="message"*/}
                        {/*    variant="outlined"*/}
                        {/*    onChange={(e) => this.handleChange(e)}*/}
                        {/*    onKeyDown={(event) => this.submitMessage(event)}*/}
                        {/*    margin="normal"*/}
                        {/*    label="Your message"*/}
                        {/*    name="message"*/}
                        {/*    value={this.state.message}*/}
                        {/*    autoFocus*/}
                        {/*    style={{width: "90%"}}*/}
                        {/*/>*/}
                        <Button
                            onClick={this.sendMessage}
                            variant="contained"
                            color="primary"
                            style={{
                                marginLeft: "3px",
                                maxWidth: "20px"
                            }}
                            // disabled={this.state.message === "" || !this.state.imageLoaded}
                            disabled={!this.state.imageLoaded && this.state.message === ""}
                        >
                            <DoubleArrowIcon/>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(WebSocketContainer);
