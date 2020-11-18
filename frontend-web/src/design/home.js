import React, {Component} from "react";
import {generateColorMode} from "./style/enable-dark-mode";
import Toaster from "./utils/toaster";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openToaster: false,
            toasterText: false,
            severity: null
        };
    }

    componentDidMount() {
        if (this.props.location !== undefined && this.props.location.openToaster) {
            this.setState({
                openToaster: true,
                toasterText: this.props.location.text,
                severity: this.props.location.severity
            })
        }
    }

    render() {
        return (
            <div className={generateColorMode(this.props.isDarkModeEnable)}
                 style={{width: "100%", height: "calc(100% - 64px)", textAlign: "center"}}>
                <img src={"/assets/img/messengerlite.png"} alt={"messenger lite"} width={"200px"}/>
                <Toaster toasterOpened={this.state.openToaster} text={this.state.toasterText}
                         severity={this.state.severity}/>
            </div>
        )
    }
}

export default HomePage;