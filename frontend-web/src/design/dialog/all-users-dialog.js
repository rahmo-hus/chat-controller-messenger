import React, {Component} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AuthService from "../../service/auth-service";
import {generateIconColorMode} from "../style/enable-dark-mode";

class AllUsersDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupOpen: false,
            usersList: null,
            usersInConversationList: [],
        };
    }

    handleDialogAction(action) {
        switch (action) {
            case "open":
                AuthService.fetchAllUsers().then(r => {
                    this.setState({usersList: r.data})
                });
                this.setState({popupOpen: true});
                break;
            case "close":
                this.setState({popupOpen: false});
                this.props.closeDialog("close");
                break;
            default:
                throw new Error("Cannot handle AddUserAction");
        }
    }

    doUserDialogAction(event, value) {
        this.props.doUserDialogAction(event, value);
        this.handleDialogAction("close");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.open !== this.props.open) {
            if (prevProps.open) {
                this.setState({popupOpen: true}, () => {
                    this.handleDialogAction("open")
                })
            } else {
                console.log("CLOSE")
                this.setState({popupOpen: false}, () => {
                    this.handleDialogAction("close")
                })
            }
        }
    }

    render() {
        return (
            <Dialog onClose={() => this.handleDialogAction("close")}
                    aria-labelledby="simple-dialog-title"
                    fullWidth
                    open={this.state.popupOpen}>
                <DialogTitle id="simple-dialog-title">{this.props.dialogTitleText}</DialogTitle>
                <List>
                    {
                        this.state.popupOpen && this.state.usersList && this.state.usersList.map(data => (
                            <ListItem button key={data.id}
                                      onClick={(event => this.doUserDialogAction(event, data.id))}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AccountCircleIcon
                                            style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={
                                    <React.Fragment>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            {data.firstName + " " + data.lastName}
                                            {
                                                data.id === this.props.userId && " (You)"
                                            }
                                        </span>
                                    </React.Fragment>
                                }
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Dialog>
        )
    }
}

export default AllUsersDialog;