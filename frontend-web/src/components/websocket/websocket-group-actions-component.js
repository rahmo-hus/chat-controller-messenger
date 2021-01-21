import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import {generateIconColorMode} from "../../design/style/enable-dark-mode";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIcon from "@material-ui/icons/Group";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import SecurityIcon from "@material-ui/icons/Security";
import PersonIcon from "@material-ui/icons/Person";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import React, {useEffect, useState} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AuthService from "../../service/auth-service";
import AllUsersDialog from "../../design/dialog/all-users-dialog";

export const WebSocketGroupActionComponent = ({isDarkModeToggled, userId, currentActiveGroup}) => {
    const [paramsOpen, setParamsOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [usersInConversation, setUsersInConversation] = useState([]);
    const [isCurrentUserAdmin, setCurrentUserIsAdmin] = useState(false);
    const [toolTipAction, setToolTipAction] = useState(false);
    const [openTooltipId, setToolTipId] = useState(null);

    useEffect(() => {
        clearData()
        return () => {
            clearData()
        }
    }, [currentActiveGroup])


    function handleTooltipAction(event, action) {
        event.preventDefault();
        if (action === "open") {
            setToolTipAction(true)
        }
        if (action === "close") {
            setToolTipAction(false)
            setToolTipId(null)
        }
    }

    function clearData() {
        setToolTipAction(false)
        setToolTipId(null)
        setCurrentUserIsAdmin(false)
        setUsersInConversation([])
        setPopupOpen(false)
        setParamsOpen(false)
    }

    function handleDisplayUserAction(event, id) {
        event.preventDefault();
        setToolTipId(id)
    }

    function closeDisplayUserAction(event) {
        event.preventDefault();
        setToolTipAction(false)
        setToolTipId(null)
    }

    function handleClick(event, target) {
        event.preventDefault();
        switch (target) {
            case "param":
                const groupUrl = localStorage.getItem("_cAG")
                usersInConversation.length === 0 && AuthService.fetchAllUsersInConversation(groupUrl).then(r => {
                    console.log(r.data)
                    r.data.forEach((val) => {
                        if (val.userId === userId && val.admin) {
                            setCurrentUserIsAdmin(true);
                        }
                    })
                    setUsersInConversation(r.data)
                })
                setParamsOpen(!paramsOpen);
                break
            default:
                throw new Error("Error, please refresh page")
        }
    }

    function handleAddUserAction(action) {
        switch (action) {
            case "open":
                // AuthService.fetchAllUsers().then(r => {
                //     this.setState({usersList: r.data})
                // });
                setPopupOpen(true)
                break;
            case "close":
                setPopupOpen(false)
                break;
            default:
                throw new Error("Cannot handle AddUserAction");
        }
    }

    function leaveGroup() {

    }

    function removeUserFromAdminListInConversation() {

    }

    function grantUserAdminInConversation() {

    }

    function addUserInConversation() {

    }

    function removeUserFromConversation() {

    }


    return (
        <div>
            <div className={"sidebar"}>
                <List
                    component="nav">
                    <ListItem button onClick={() => handleAddUserAction("open")}>
                        <ListItemIcon>
                            <GroupAddIcon style={{color: generateIconColorMode(isDarkModeToggled)}}/>
                        </ListItemIcon>
                        <ListItemText primary="Add user to group"/>
                    </ListItem>
                    <ListItem button onClick={(event) => handleClick(event, "param")}>
                        <ListItemIcon>
                            <GroupIcon style={{color: generateIconColorMode(isDarkModeToggled)}}/>
                        </ListItemIcon>
                        <ListItemText primary="Members"/>
                        {paramsOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={paramsOpen}>
                        <List component="div" disablePadding>
                            {paramsOpen && usersInConversation.map((value, index) => (
                                <ListItem key={index}
                                          onMouseEnter={event => handleDisplayUserAction(event, index)}
                                          onMouseLeave={event => closeDisplayUserAction(event)}>
                                    <ListItemIcon>
                                        {
                                            value.admin ? <SecurityIcon
                                                    style={{color: generateIconColorMode(isDarkModeToggled)}}/> :
                                                <PersonIcon
                                                    style={{color: generateIconColorMode(isDarkModeToggled)}}/>
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={value.firstName + " " + value.lastName}/>
                                    <ListItemSecondaryAction
                                        onMouseEnter={event => handleDisplayUserAction(event, index)}
                                        onMouseLeave={event => closeDisplayUserAction(event)}
                                    >
                                        {openTooltipId === index ?
                                            <Tooltip
                                                interactive={true}
                                                PopperProps={{
                                                    disablePortal: false,
                                                }}
                                                onClose={event => handleTooltipAction(event, "close")}
                                                open={toolTipAction}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                title={
                                                    <React.Fragment>
                                                        <div>
                                                            {
                                                                isCurrentUserAdmin && value.admin &&
                                                                <MenuItem
                                                                    onClick={event => removeUserFromAdminListInConversation(event, value.userId)}
                                                                    dense={true}>Remove from
                                                                    administrator
                                                                </MenuItem>
                                                            }
                                                            {
                                                                isCurrentUserAdmin && !value.admin &&
                                                                <MenuItem
                                                                    onClick={event => grantUserAdminInConversation(event, value.userId)}
                                                                    dense={true}>Grant
                                                                    administrator</MenuItem>
                                                            }
                                                            {
                                                                !(userId === value.userId) &&
                                                                <MenuItem
                                                                    onClick={event => removeUserFromConversation(event, value.userId)}
                                                                    dense={true}>Remove from group</MenuItem>
                                                            }
                                                            {
                                                                userId === value.userId &&
                                                                <MenuItem
                                                                    onClick={event => leaveGroup(event)}
                                                                    dense={true}>Leave group</MenuItem>
                                                            }
                                                        </div>
                                                    </React.Fragment>
                                                }>
                                                <IconButton
                                                    onClick={event => handleTooltipAction(event, "open")}
                                                    style={{color: generateIconColorMode(isDarkModeToggled)}}>
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
            <AllUsersDialog closeDialog={handleAddUserAction}
                            open={popupOpen}
                            dialogTitleText={"Add people to conversation"}
                            doUserDialogAction={addUserInConversation}/>
        </div>
    )
}