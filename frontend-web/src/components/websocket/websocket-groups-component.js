import React, {useEffect, useState} from "react";
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
import {useHistory} from "react-router-dom";
import {dateParser} from "../../utils/date-formater";


const Clock = ({date}) => {
    const [currentCount, setCount] = useState(dateParser(date));
    const [index, setIndex] = useState(0);

    useEffect(() => {
            setIndex(1)
            const dateInterval = setInterval(() => {
                setCount(dateParser(date))
            }, 60000);
            return () => {
                setIndex(0)
                clearInterval(dateInterval);
            }
        },
        [currentCount]
    );
    return (
            <React.Fragment>
            {/*{index === 0 ?*/}
            {/*    dateParser(date)*/}
            {/*    :*/}
            {/*    currentCount*/}
            {/*}*/}
                {dateParser(date)}
        </React.Fragment>
    )
};


export const WebsocketGroupsComponent = ({
                                             isDarkModeToggled,
                                             currentThemeMode,
                                             isWsConnected,
                                             setCurrentActiveGroup,
                                             currentActiveGroup,
                                             wsUserGroups
                                         }) => {
    const history = useHistory();

    function redirectToGroup(id, url) {
        setCurrentActiveGroup(url);
        localStorage.setItem("_cAG", url)
        history.push("/t/messages/" + url)
    }

    function handleAddUserAction() {

    }

    function styleSelectedGroup(selectedUrl) {
        if (generateColorMode(isDarkModeToggled) === "light") {
            return selectedUrl === localStorage.getItem("_cAG") ? "selected-group-light" : "";
        }
        if (generateColorMode(isDarkModeToggled) === "dark") {
            return selectedUrl === localStorage.getItem("_cAG") ? "selected-group-dark" : "";
        }
    }

    function styleUnreadMessage(isLastMessageSeen) {
        return isLastMessageSeen ? isDarkModeToggled ? "bold-unread-message-light" : "bold-unread-message-dark" : "";
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
                                    <span
                                        className={styleUnreadMessage(data.lastMessageSeen)}>{data.name}
                                    </span>
                                </React.Fragment>}
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
                                            {data.lastMessage} <span style={{fontWeight: "bold"}}> · </span><Clock
                                            date={data.lastMessageDate}/>
                                        </span>
                                            {/*<span className={"clrcstm"} style={{fontWeight: "inherit"}}>*/}
                                            {/*   <Clock date={data.lastMessageDate}/>*/}
                                            {/*</span>*/}
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