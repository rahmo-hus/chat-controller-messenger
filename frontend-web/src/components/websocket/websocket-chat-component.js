import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import CallIcon from "@material-ui/icons/Call";
import ImageIcon from "@material-ui/icons/Image";
import CustomTextField from "../../design/partials/custom-material-textfield";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import React from "react";

export const WebSocketChatComponent = (props) => {
    const message = "";
    const imageLoaded = false;

    function styleSelectedMessage() {

    }

    function generateImageRender() {

    }

    function resetImageBuffer() {

    }

    function previewFile() {

    }

    function submitMessage() {

    }

    function openCallPage() {

    }

    function handleChange() {

    }

    function sendMessage() {
        chatHistory.push("")
    }

    const imagePreviewUrl = "";
    const chatHistory = [];

    return (
        <div style={{display: "flex", flex: "1", flexDirection: "column"}}>
            <div style={{
                backgroundColor: "transparent",
                width: "100%",
                height: "calc(100% - 56px)",
                overflowY: "scroll"
            }}>
                {/*<ImagePreview displayImagePreview={displayImagePreview}*/}
                {/*              changeDisplayImagePreview={handleImagePreview}*/}
                {/*              isDarkModeEnable={props.isDarkModeEnable}*/}
                {/*              imgSrc={imgSrc}*/}
                {/*/>*/}
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
                {/*<div style={{float: "left", clear: "both"}}*/}
                {/*     ref={(el) => {*/}
                {/*         messagesEnd = el;*/}
                {/*     }}>*/}
                {/*</div>*/}
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
                            {/*<img src={imagePreviewUrl} alt={"whu"}/>*/}
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
                    <Button onClick={event => openCallPage(event)} variant="text" component="span">
                        <CallIcon/>
                    </Button>
                    <label htmlFor="raised-button-file">
                        <Button variant="text" component="span">
                            <ImageIcon/>
                        </Button>
                    </label>
                    <CustomTextField
                        id={"inputChatMessenger"}
                        label={"Write a message"}
                        value={message}
                        handleChange={handleChange}
                        type={"text"}
                        keyUp={submitMessage}
                        isDarkModeEnable={props.isDarkModeEnable}
                    />
                    <Button
                        onClick={sendMessage}
                        variant="contained"
                        color="primary"
                        style={{
                            marginLeft: "3px",
                            maxWidth: "20px"
                        }}
                        // disabled={message === "" || !imageLoaded}
                        disabled={!imageLoaded && message === ""}
                    >
                        <DoubleArrowIcon/>
                    </Button>
                </div>
            </div>
        </div>
    )
}