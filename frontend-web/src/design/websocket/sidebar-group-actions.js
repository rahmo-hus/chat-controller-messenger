import React, {Component} from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AuthService from "../../service/auth-service";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from "@material-ui/core/Collapse";
import SecurityIcon from '@material-ui/icons/Security';
import PersonIcon from '@material-ui/icons/Person';

class SidebarGroupActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupOpen: false,
            paramsOpen: false,
            adminOpen: false,
            usersInConversationList: [],
            usersList: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderUserInConversation = this.renderUserInConversation.bind(this);
    }


    handleClose(event, order) {
        event.preventDefault();
        if (order === "open") {
            AuthService.fetchAllUsers().then(r => {
                this.setState({usersList: r.data})
            });
            this.setState({popupOpen: true});
        } else {
            this.setState({popupOpen: false})
        }
    }

    addUser(event, userId) {
        event.preventDefault();
        AuthService.addUserToGroup(userId, this.props.groupUrl).then(r => {
            console.log(r.status);
        })
    }


    handleClick(event, target) {
        event.preventDefault();
        switch (target) {
            case "admin":
                this.setState(prevState => {
                    return {
                        adminOpen: !prevState.adminOpen
                    }
                });
                break
            case "param":
                this.state.usersInConversationList.length === 0 && AuthService.fetchAllUsersInConversation(5).then(r => {
                    this.setState({usersInConversationList: r.data})
                })
                this.setState(prevState => {
                    return {
                        paramsOpen: !prevState.paramsOpen
                    }
                });
                break
            default:
                throw new Error("Error, please refresh page")
        }
    }

    renderUserInConversation() {
        AuthService.fetchAllUsersInConversation(5).then(r => {
            r.data.map(function (value) {
                return (
                    <div>
                        <ListItemIcon>
                            <PersonIcon/>
                        </ListItemIcon>
                        <ListItemText primary={value.firstName + " " + value.lastName}/>
                    </div>
                )
            })
        })
    }

    render() {
        return (
            <Drawer variant="permanent" anchor={"right"} elevation={0}>
                <div
                    style={{width: "240px"}}>
                    <div style={{minHeight: "64px"}}/>
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Parameters
                            </ListSubheader>
                        }>
                        <ListItem button onClick={event => this.handleClick(event, "admin")}>
                            <ListItemIcon>
                                <SecurityIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Administrators"/>
                            {this.state.adminOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.adminOpen} timeout="auto">
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemIcon>
                                        <StarBorder/>
                                    </ListItemIcon>
                                    <ListItemText primary="Thibaut"/>
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button>
                            <ListItemIcon>
                                <DraftsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Members"/>
                        </ListItem>
                        <ListItem button onClick={(event) => this.handleClick(event, "param")}>
                            <ListItemIcon>
                                <InboxIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Inbox"/>
                            {this.state.paramsOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.paramsOpen} timeout="auto">
                            <List component="div" disablePadding>
                                {this.state.paramsOpen && this.state.usersInConversationList.map((value, index) => (
                                    <ListItem key={index} button>
                                        <ListItemIcon>
                                            <PersonIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={value.firstName + " " + value.lastName}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>
                </div>
                <Dialog onClose={(event) => this.handleClose(event, "close")} aria-labelledby="simple-dialog-title"
                        open={this.state.popupOpen}>
                    <DialogTitle id="simple-dialog-title">Add people to conversation</DialogTitle>
                    <List>
                        {
                            this.state.popupOpen && this.state.usersList && this.state.usersList.map(data => (
                                <ListItem button key={data.id} onClick={(event => this.addUser(event, data.id))}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountCircleIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={data.firstName + " " + data.lastName}/>
                                </ListItem>
                            ))
                        }
                    </List>
                </Dialog>
            </Drawer>
        )
    }
}

export default SidebarGroupActions