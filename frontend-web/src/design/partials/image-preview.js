import React, {Component} from "react";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {generateIconColorMode} from "../style/enable-dark-mode";
import Tooltip from "@material-ui/core/Tooltip";

class ImagePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayImagePreview: false,
        };
        this.closeDisplayImagePreview = this.closeDisplayImagePreview.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.displayImagePreview !== this.props.displayImagePreview) {
            this.setState({displayImagePreview: this.props.displayImagePreview})
            if (this.props.displayImagePreview) {
                document.addEventListener("keyup", this.closeDisplayImagePreview, false);
            }
        }
    }

    handleImagePreview(event, action) {
        event.preventDefault();
        switch (action) {
            case "OPEN":
                this.setState({displayImagePreview: true})
                this.props.changeDisplayImagePreview(event, "OPEN")
                break;
            case "CLOSE":
                this.setState({displayImagePreview: false})
                this.props.changeDisplayImagePreview(event, "CLOSE")
                break;
            default:
                throw new Error("handleImagePreview failed");
        }
    }

    // componentDidMount() {
    //     document.addEventListener("keydown", this.closeDisplayImagePreview, false);
    // }
    //
    // componentWillUnmount() {
    //     document.removeEventListener("keydown", this.closeDisplayImagePreview, false);
    // }

    closeDisplayImagePreview(event) {
        event.preventDefault();
        if (event.key === "Escape") {
            this.setState({displayImagePreview: false});
            this.props.changeDisplayImagePreview(event, "CLOSE");
            document.removeEventListener("keyup", this.closeDisplayImagePreview, false);
        }
    }


    render() {
        return (
            <React.Fragment>
                {this.state.displayImagePreview &&
                <div style={{
                    position: "fixed",
                    zIndex: "1200",
                    right: "0",
                    bottom: "0",
                    top: "0",
                    left: "0",
                    backdropFilter: "blur(20px)",
                    backgroundColor: "rgba(0, 0, 0, .5)"
                }}/>
                }
                {
                    this.state.displayImagePreview &&
                    <div
                        style={{
                            position: "fixed",
                            zIndex: "1300",
                            right: "2%",
                            bottom: " 2%",
                            top: " 3%",
                            left: "2%",
                            backgroundColor: "transparent",
                            borderRadius: "10px",
                            border: "1px solid white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <div style={{
                            zIndex: "1400",
                            right: "10px",
                            position: "absolute",
                            top: "10px"
                        }}>
                            <Tooltip title='Press "Escape" to close'>
                                <IconButton onClick={event => this.handleImagePreview(event, "CLOSE")}>
                                    <CloseIcon style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div style={{
                            filter: "blur(1.5rem)",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: "0.5"
                        }}/>
                        <img style={{maxHeight: "-webkit-fill-available"}} src={this.props.imgSrc}
                             alt="real size"/>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default ImagePreview;
