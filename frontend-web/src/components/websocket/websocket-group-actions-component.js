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
import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

export const WebSocketGroupActionComponent = (props) => {
    const paramsOpen = false;
    const toolTipAction = false;
    const usersInConversationList = [];
    const openTooltipId = 2;
    const isCurrentUserAdmin = true;

    function handleTooltipAction() {
        usersInConversationList.push("");
    }

    function handleDisplayUserAction() {

    }

    function closeDisplayUserAction() {

    }

    function handleClick() {

    }

    function handleAddUserAction() {

    }

    function leaveGroup() {

    }

    function removeUserFromAdminListInConversation() {

    }

    function grantUserAdminInConversation() {

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
                            <GroupAddIcon style={{color: generateIconColorMode(props.isDarkModeEnable)}}/>
                        </ListItemIcon>
                        <ListItemText primary="Add user to group"/>
                    </ListItem>
                    <ListItem button onClick={(event) => handleClick(event, "param")}>
                        <ListItemIcon>
                            <GroupIcon style={{color: generateIconColorMode(props.isDarkModeEnable)}}/>
                        </ListItemIcon>
                        <ListItemText primary="Members"/>
                        {paramsOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={paramsOpen}>
                        <List component="div" disablePadding>
                            {paramsOpen && usersInConversationList.map((value, index) => (
                                <ListItem key={index}
                                          onMouseEnter={event => handleDisplayUserAction(event, index)}
                                          onMouseLeave={event => closeDisplayUserAction(event)}>
                                    <ListItemIcon>
                                        {
                                            value.admin ? <SecurityIcon
                                                    style={{color: generateIconColorMode(props.isDarkModeEnable)}}/> :
                                                <PersonIcon
                                                    style={{color: generateIconColorMode(props.isDarkModeEnable)}}/>
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
                                                                !(props.userId === value.userId) &&
                                                                <MenuItem
                                                                    onClick={event => removeUserFromConversation(event, value.userId)}
                                                                    dense={true}>Remove from group</MenuItem>
                                                            }
                                                            {
                                                                props.userId === value.userId &&
                                                                <MenuItem
                                                                    onClick={event => leaveGroup(event)}
                                                                    dense={true}>Leave group</MenuItem>
                                                            }
                                                        </div>
                                                    </React.Fragment>
                                                }>
                                                <IconButton
                                                    onClick={event => handleTooltipAction(event, "open")}
                                                    style={{color: generateIconColorMode(props.isDarkModeEnable)}}>
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
        </div>
    )
}