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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupIcon from '@material-ui/icons/Group';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import SecurityIcon from '@material-ui/icons/Security';
import PersonIcon from '@material-ui/icons/Person';
import {generateIconColorMode} from "../style/enable-dark-mode";
import {withRouter} from "react-router-dom";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuItem from "@material-ui/core/MenuItem";
import Toaster from "../utils/toaster";
import Tooltip from "@material-ui/core/Tooltip";

class SidebarGroupActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupOpen: false,
            toolTipAction: false,
            paramsOpen: false,
            usersInConversationList: [],
            usersList: null,
            isCurrentUserAdmin: null,

            //Toaster
            toasterOpened: false,
            toasterText: null,

            // Tooltip
            openTooltipId: null,
            anchorEl: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleTooltipAction = this.handleTooltipAction.bind(this);
        this.handleDisplayUserAction = this.handleDisplayUserAction.bind(this);
        this.addUserInConversation = this.addUserInConversation.bind(this);
        this.closeDisplayUserAction = this.closeDisplayUserAction.bind(this);
        this.leaveGroup = this.leaveGroup.bind(this);
    }


    handleAddUserAction(event, action) {
        event.preventDefault();
        switch (action) {
            case "open":
                AuthService.fetchAllUsers().then(r => {
                    this.setState({usersList: r.data})
                });
                this.setState({popupOpen: true});
                break;
            case "close":
                this.setState({popupOpen: false});
                break;
            default:
                throw new Error("Cannot handle AddUserAction");
        }

    }

    handleClick(event, target) {
        event.preventDefault();
        switch (target) {
            case "param":
                const groupUrl = this.props.location.pathname.split("/").slice(-1)[0];
                this.state.usersInConversationList.length === 0 && AuthService.fetchAllUsersInConversation(groupUrl).then(r => {
                    console.log(r.data)
                    r.data.forEach((val) => {
                        console.log(this.props.userId)
                        console.log(val.userId === this.props.userId)
                        console.log(val.userId === this.props.userId && val.admin)
                        if (val.userId === this.props.userId && val.admin) {
                            this.setState({isCurrentUserAdmin: true})
                        }
                    })
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

    addUserInConversation(event, userId) {
        event.preventDefault();
        AuthService.addUserToGroup(userId, this.props.groupUrl).then(r => {
            this.setState({popupOpen: false})
            if (r.status === 200) {
                AuthService.fetchAllUsersInConversation(this.props.groupUrl).then(r => {
                    this.setState({
                        usersInConversationList: r.data,
                        toasterOpened: true,
                        toasterText: "User has been added to conversation"
                    })
                });

            }
        }).catch(() => {
            this.setState({popupOpen: false})
        });
    }

    removeUserFromConversation(event, userId) {
        event.preventDefault();
        AuthService.removeUserFromConversation(userId, this.props.groupUrl).then(r => {
            if (r.status === 200) {
                AuthService.fetchAllUsersInConversation(this.props.groupUrl).then(r => {
                    this.setState({
                        usersInConversationList: r.data,
                        toasterOpened: true,
                        toasterText: "User has been deleted from group"
                    });
                });
            }
        }).catch();
    }

    leaveGroup(event) {
        event.preventDefault();
        AuthService.leaveConversation(this.props.userId, this.props.groupUrl).then(r => {
            if (r.status === 200) {
                console.log("SUCCESS")
                this.props.location.push("/t/messages");
            }
        }).catch();
    }

    grantUserAdminInConversation(event, userId) {
        event.preventDefault();
        AuthService.grantUserAdminInConversation(userId, this.props.groupUrl).then(r => {
            if (r.status === 200) {
                AuthService.fetchAllUsersInConversation(this.props.groupUrl).then(r => {
                    this.setState({
                        toasterOpened: true,
                        toasterText: "User has been removed from administrators",
                        usersInConversationList: r.data
                    });
                })
            }
        }).catch(err => err);
    }

    removeUserFromAdminListInConversation(event, userId) {
        event.preventDefault();
        console.log("USer remove from administrator")
        AuthService.removeAdminUserInConversation(userId, this.props.groupUrl).then(() => {
            AuthService.fetchAllUsersInConversation(this.props.groupUrl).then(r => {
                this.setState({
                    toasterOpened: true,
                    toasterText: "User has been removed from administrators",
                    usersInConversationList: r.data
                });
            })
        }).catch();
    }

    handleDisplayUserAction(event, id) {
        event.preventDefault();
        this.setState({
            openTooltipId: id
        });
    }

    closeDisplayUserAction(event) {
        event.preventDefault();
        this.setState({
            openTooltipId: null,
            toolTipAction: false
        });
    }

    handleTooltipAction(event, action) {
        event.preventDefault();
        if (action === "open") {
            this.setState({toolTipAction: true})
        }
        if (action === "close") {
            this.setState({toolTipAction: false, openTooltipId: null})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activate !== this.props.activate) {
            this.setState({
                popupOpen: false,
                paramsOpen: false,
                anchorEl: null,
                usersInConversationList: [],
                toolTipAction: false,
                usersList: null,
                isCurrentUserAdmin: null
            })
        }
    }

    render() {
        return (
            <div>
                <div className={"sidebar"}>
                    <List
                        component="nav">
                        <ListItem button onClick={(event) => this.handleAddUserAction(event, "open")}>
                            <ListItemIcon>
                                <GroupAddIcon style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                            </ListItemIcon>
                            <ListItemText primary="Add user to group"/>
                        </ListItem>
                        <ListItem button onClick={(event) => this.handleClick(event, "param")}>
                            <ListItemIcon>
                                <GroupIcon style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                            </ListItemIcon>
                            <ListItemText primary="Members"/>
                            {this.state.paramsOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.paramsOpen}>
                            <List component="div" disablePadding>
                                {this.state.paramsOpen && this.state.usersInConversationList.map((value, index) => (
                                    <ListItem key={index}
                                              onMouseEnter={event => this.handleDisplayUserAction(event, index)}
                                              onMouseLeave={event => this.closeDisplayUserAction(event)}>
                                        <ListItemIcon>
                                            {
                                                value.admin ? <SecurityIcon
                                                        style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/> :
                                                    <PersonIcon
                                                        style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                                            }
                                        </ListItemIcon>
                                        <ListItemText primary={value.firstName + " " + value.lastName}/>
                                        <ListItemSecondaryAction
                                            onMouseEnter={event => this.handleDisplayUserAction(event, index)}
                                            onMouseLeave={event => this.closeDisplayUserAction(event)}
                                        >
                                            {this.state.openTooltipId === index ?
                                                <Tooltip
                                                    interactive={true}
                                                    PopperProps={{
                                                        disablePortal: false,
                                                    }}
                                                    onClose={event => this.handleTooltipAction(event, "close")}
                                                    open={this.state.toolTipAction}
                                                    disableFocusListener
                                                    disableHoverListener
                                                    disableTouchListener
                                                    title={
                                                        <React.Fragment>
                                                            <div>
                                                                {
                                                                    this.state.isCurrentUserAdmin && value.admin &&
                                                                    <MenuItem
                                                                        onClick={event => this.removeUserFromAdminListInConversation(event, value.userId)}
                                                                        dense={true}>Remove from
                                                                        administrator
                                                                    </MenuItem>
                                                                }
                                                                {
                                                                    this.state.isCurrentUserAdmin && !value.admin &&
                                                                    <MenuItem
                                                                        onClick={event => this.grantUserAdminInConversation(event, value.userId)}
                                                                        dense={true}>Grant
                                                                        administrator</MenuItem>
                                                                }
                                                                {
                                                                    !(this.props.userId === value.userId) &&
                                                                    <MenuItem
                                                                        onClick={event => this.removeUserFromConversation(event, value.userId)}
                                                                        dense={true}>Remove from group</MenuItem>
                                                                }
                                                                {
                                                                    this.props.userId === value.userId &&
                                                                    <MenuItem
                                                                        onClick={event => this.leaveGroup(event)}
                                                                        dense={true}>Leave group</MenuItem>
                                                                }
                                                            </div>
                                                        </React.Fragment>
                                                    }>
                                                    <IconButton
                                                        onClick={event => this.handleTooltipAction(event, "open")}
                                                        style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}>
                                                        <MoreHorizIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                value.admin ?
                                                    "Administrator" : <IconButton/>
                                            }
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>
                </div>
                <Dialog onClose={(event) => this.handleAddUserAction(event, "close")}
                        aria-labelledby="simple-dialog-title"
                        fullWidth
                        open={this.state.popupOpen}>
                    <DialogTitle id="simple-dialog-title">Add people to conversation</DialogTitle>
                    <List>
                        {
                            this.state.popupOpen && this.state.usersList && this.state.usersList.map(data => (
                                <ListItem button key={data.id}
                                          onClick={(event => this.addUserInConversation(event, data.id))}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountCircleIcon
                                                style={{color: generateIconColorMode(this.props.isDarkModeEnable)}}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={
                                        <React.Fragment>
                                                                <span style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-around"
                                                                }}>
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
                <Toaster toasterOpened={this.state.toasterOpened} text={this.state.toasterText}/>
            </div>
        )
    }
}

export default withRouter(SidebarGroupActions);