import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {generateColorMode, generateLinkColorMode} from "../../design/style/enable-dark-mode";
import ErrorIcon from "@material-ui/icons/Error";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import {Link} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import {TypeGroupEnum} from "../../utils/type-group-enum";
import FolderIcon from "@material-ui/icons/Folder";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItemText from "@material-ui/core/ListItemText";
import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";

export const WebsocketGroupsComponent = ({isDarkModeToggled, currentThemeMode, wsUserGroups, isWsConnected}) => {
// export const WebsocketGroupsComponent = (props) => {
    const history = useHistory();
    // const {wsValue} = getState().WebSocketReducer;
    useEffect(() => {

    }, [])

    function redirectToGroup(id, url) {
        console.log(id);
        history.push("/t/messages/" + url)
    }

    function handleAddUserAction() {

    }

    function styleSelectedGroup() {

    }

    function styleUnreadMessage() {

    }

    return (
        <div
            className={"sidebar"}
            style={{borderRight: "1px solid #C8C8C8", overflowY: "scroll"}}>

            <Collapse in={!isWsConnected}>
                <Alert severity="error">
                    Application is currently unavailable
                </Alert>
            </Collapse>

            <div style={{marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <span style={{marginLeft: "10px", fontSize: "20px", fontWeight: "bold"}}>
                        Discussions
                    </span>
                <div>
                    <IconButton onClick={() => handleAddUserAction("open")}>
                        <AddCircleIcon fontSize={"large"}/>
                    </IconButton>
                </div>
            </div>
            {
                wsUserGroups && wsUserGroups.length === 0 &&
                <div
                    className={generateColorMode(isDarkModeToggled)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        marginTop: "20px"
                    }}>
                    <ErrorIcon fontSize={"large"}/>
                    <h4>
                        You don't have a group yet !
                    </h4>
                    <div style={{display: "flex"}}>
                        <ArrowRightAltIcon/>
                        <Link style={{color: generateLinkColorMode(isDarkModeToggled)}} className={"lnk"}
                              to={"/create"}>Create group</Link>
                    </div>
                </div>
            }
            <List>
                {wsUserGroups && wsUserGroups.map(data => (
                    <ListItem className={styleSelectedGroup(data.url)} button key={data.id}
                              onClick={() => redirectToGroup(data.id, data.url)}>
                        <Avatar>
                            {
                                data.groupType === TypeGroupEnum.GROUP ?
                                    <FolderIcon/>
                                    :
                                    <AccountCircleIcon/>
                            }
                        </Avatar>
                        <ListItemText
                            style={{marginLeft: "5px"}}
                            primary={
                                <React.Fragment>
                                        <span className={styleUnreadMessage(data.lastMessageSeen)}>
                                            {data.name}
                                        </span>
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                        <span
                                            className={styleUnreadMessage(data.lastMessageSeen) + " group-subtitle-color"}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}>
                                            <span
                                                className={"clrcstm"}
                                                style={{
                                                    overflowX: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis"
                                                }}>
                                                {data.lastMessage}
                                            </span>
                                            <span className={"clrcstm"} style={{fontWeight: "inherit"}}>
                                                {data.lastMessageDate}
                                            </span>
                                        </span>
                                </React.Fragment>}
                        />
                    </ListItem>
                ))}
            </List>
            {/*<AllUsersDialog closeDialog={handleAddUserAction}*/}
            {/*                doUserDialogAction={createConversation}*/}
            {/*                open={popupOpen}*/}
            {/*                dialogTitleText={"Start conversation with someone"}/>*/}
        </div>
    )
}