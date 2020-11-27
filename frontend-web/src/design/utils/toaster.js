import React, {Component} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

class Toaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toasterOpened: false,
        };
        this.closeDeleteUserToaster = this.closeDeleteUserToaster.bind(this)
    }

    closeDeleteUserToaster() {
        this.setState({toasterOpened: false})
    }

    componentDidMount() {
        if (this.props !== undefined) {
            this.setState({toasterOpened: this.props.openToaster})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.toasterOpened !== this.props.toasterOpened) {
            this.setState({toasterOpened: this.props.toasterOpened})
        }
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.toasterOpened}
                // open={true}
                autoHideDuration={5000}
                onClose={this.closeDeleteUserToaster}>
                <Alert onClose={this.closeDeleteUserToaster}
                       severity={this.props.severity}
                       variant={"filled"}>
                    {this.props.text}
                </Alert>
            </Snackbar>
        )
    }
}

export default Toaster;
