import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import CustomTextField from "../../design/partials/custom-material-textfield";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import React, {useEffect} from "react";
import ImagePreview from "../../design/partials/image-preview";
import CallWindowContainer from "../../container/call-window-container";
import UUIDv4 from "../../utils/uuid-generator";
import MessageModel from "../../model/message-model";

export const WebSocketChatComponent = ({
                                           isDarkModeEnable,
                                           isDarkModeToggled,
                                           currentActiveGroup,
                                           sendWsMessage,
                                           fetchMessages,
                                           chatHistory,
                                           userId
                                       }) => {

    const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState(null);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [message, setMessage] = React.useState("");
    let messageEnd;

    const currentUrl = window.location.pathname.split("/").slice(-1)[0];
    useEffect(() => {
        // console.log(currentUrl)
        fetchMessages(currentUrl);
    }, [currentUrl])

    useEffect(() => {
        scrollToEnd()
    }, [chatHistory])

    function styleSelectedMessage() {
        return isDarkModeToggled ? "hover-msg-dark" : "hover-msg-light";
    }

    function generateImageRender(message) {
        const data = JSON.parse(message);
        if (data.url === undefined) {
            return null;
        }
        return (
            <div>
                <img src={data.url} height={"200px"} alt={data.name}
                     onClick={event => handleImagePreview(event, "OPEN", data.url)}
                     style={{border: "1px solid #c8c8c8", borderRadius: "7%"}}/>
            </div>)
    }

    function resetImageBuffer(event) {
        event.preventDefault();
        setFile(null);
        setImagePreviewUrl("");
        setImageLoaded(false);
    }

    function previewFile(event) {
        resetImageBuffer(event);
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.readAsDataURL(file)

        reader.onload = (e) => {
            if (e.target.readyState === FileReader.DONE) {
                setFile(file);
                setImagePreviewUrl(reader.result);
                setImageLoaded(true);
            }
        };
    }

    function submitMessage(event) {
        if (message !== "") {
            if (event.key === undefined || event.key === 'Enter') {
                sendMessage();
                setMessage("");
            }
        }
    }

    function handleChange(event) {
        setMessage(event.target.value);
    }

    function sendMessage() {
        const groupUrl = localStorage.getItem("_cAG");
        if (userId === null || undefined) {
            console.warn("userId is null !")
        }
        if (message !== "") {
            // console.log("Publishing text");
            // this.props.updateGroupWhenUserSendMessage(this.props.location.groupUrl, this.state.message, MessageTypeEnum.text);
            const toSend = new MessageModel(userId, groupUrl, message)
            sendWsMessage(toSend)
            setMessage("")
        }
        // if (file !== "") {
        //     console.log("Publishing file");
        //     const formData = new FormData();
        //     formData.append("file", file)
        //     formData.append("userId", userId)
        //     formData.append("groupUrl", groupUrl)
        //     AuthService.uploadFile(formData).then().catch(err => {
        //         console.log(err)
        //     })
        //     this.props.updateGroupWhenUserSendMessage(this.props.location.groupId, this.state.message, MessageTypeEnum.image);
        //     // this.props.updateGroupsArrayOnMessage(this.props.location.groupUrl);
        //     setMessage("")
        //     setImageLoaded(false)
        //     setFile("")
        //     setImagePreviewUrl("")
        // }
    }

    function scrollToEnd() {
        messageEnd.scrollIntoView({behavior: "smooth"});
    }

    function handleImagePreview(event, action, src) {
        event.preventDefault();
        switch (action) {
            case "OPEN":
                setImgSrc(src)
                setPreviewImageOpen(true)
                break;
            case "CLOSE":
                setPreviewImageOpen(false)
                break;
            default:
                throw new Error("handleImagePreview failed");
        }
    }

    function openCallPage() {
        const callUrl = UUIDv4();
        window.open("http://localhost:3000/call/" + callUrl, '_blank', "location=yes,height=570,width=520,scrollbars=yes,status=yes");
    }

    return (
        <div style={{display: "flex", flex: "1", flexDirection: "column"}}>
            <div style={{
                backgroundColor: "transparent",
                width: "100%",
                height: "calc(100% - 56px)",
                overflowY: "scroll"
            }}>
                <ImagePreview displayImagePreview={isPreviewImageOpen}
                              changeDisplayImagePreview={handleImagePreview}
                              isDarkModeEnable={isDarkModeEnable}
                              imgSrc={imgSrc}
                />
                {chatHistory && chatHistory.map((val, index, array) => (
                    <Tooltip
                        key={index}
                        enterDelay={700}
                        leaveDelay={0}
                        title={new Date(val.time).getHours() + ":" + new Date(val.time).getMinutes()}
                        placement="left">
                        <div className={'msg ' + styleSelectedMessage()} key={index}
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
                                            {generateImageRender(val.message)}
                                        </div>
                                }
                                {/*<div>{val.message}</div>*/}
                            </div>
                        </div>
                    </Tooltip>
                ))}
                <div style={{float: "left", clear: "both"}}
                     ref={(el) => {
                         messageEnd = el;
                     }}>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                    {
                        imagePreviewUrl &&
                        <div style={{
                            padding: "10px",
                            height: "120px",
                            maxWidth: "120px",
                            background: "url('" + imagePreviewUrl + "')",
                            backgroundSize: "cover",
                            position: "relative",
                            borderRadius: "10%"
                        }}>
                            <IconButton style={{
                                height: "20px",
                                position: "absolute",
                                right: " 8px",
                                top: "8px",
                                width: "20px"
                            }}
                                        onClick={event => resetImageBuffer(event)}>
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
                        onChange={event => previewFile(event)}
                    />
                    {/*<Button onClick={event => openCallPage(event)} variant="text" component="span">*/}
                    {/*    <CallIcon/>*/}
                    {/*</Button>*/}
                    <Button onClick={event => openCallPage(event)} variant="text" component="span">
                        <AcUnitIcon/>
                    </Button>
                    <CallWindowContainer/>
                    <label htmlFor="raised-button-file">
                        <Button variant="text" component="span">
                            <ImageIcon/>
                        </Button>
                    </label>
                    <CustomTextField
                        id={"inputChatMessenger"}
                        label={"Write a message"}
                        value={message}
                        handleChange={(event) => handleChange(event)}
                        type={"text"}
                        keyUp={submitMessage}
                        isDarkModeEnable={isDarkModeToggled}
                    />
                    <Button
                        onClick={sendMessage}
                        variant="contained"
                        color="primary"
                        style={{
                            marginLeft: "3px",
                            maxWidth: "20px"
                        }}
                        disabled={!imageLoaded && message === ""}
                    >
                        <DoubleArrowIcon/>
                    </Button>
                </div>
            </div>
        </div>
    )
}