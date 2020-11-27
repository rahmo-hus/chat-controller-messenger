import React, {Component} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import ErrorIcon from '@material-ui/icons/Error';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import {Link, withRouter} from "react-router-dom";
import {generateColorMode, generateLinkColorMode} from "../style/enable-dark-mode";
import "./websocketStyle.css";

let groupEventListener = null;

class SidebarGroups extends Component {

    removeUnreadMessageClassName() {

    }

    redirectToGroup(event, groupId, groupURL) {
        event.preventDefault();
        this.removeUnreadMessageClassName();
        console.log("Changing group");
        this.props.history.push({
            pathname: "/t/messages/" + groupURL,
            groupId: groupId,
            groupUrl: groupURL
        })
    }

    styleSelectedGroup(matchedUrl) {
        const groupUrl = this.props.location.pathname.split("/").slice(-1)[0];
        if (generateColorMode(this.props.isDarkModeEnable) === "light") {
            return groupUrl === matchedUrl ? "selected-group-light" : "";
        }
        if (generateColorMode(this.props.isDarkModeEnable) === "dark") {
            return groupUrl === matchedUrl ? "selected-group-dark" : "";
        }
    }


    launchGroupEventListener() {
        if (this.props.ws !== null || undefined) {
            groupEventListener = this.props.ws.subscribe("/topic/notification/" + this.props.userId, (res) => {
                this.props.updateLastMessageInGroups(JSON.parse(res.body));
            })
        } else {
            console.warn("NO WS PROPS")
        }
    }

    styleUnreadMessage(isLastMessageSeen) {
        return isLastMessageSeen ? "bold-unread-message" : "";
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activate !== this.props.activate) {
            this.launchGroupEventListener();
        }
    }

    componentWillUnmount() {
        if (groupEventListener !== null || undefined) {
            groupEventListener.unsubscribe();
        }
    }

    render() {
        return (
            <div
                className={"sidebar"}
                style={{borderRight: "1px solid #C8C8C8", overflowY: "scroll"}}>
                {
                    this.props.location.noGroups &&
                    <div
                        className={generateColorMode(this.props.isDarkModeEnable)}
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
                            <Link style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}} className={"lnk"}
                                  to={"/create"}>Create group</Link>
                        </div>
                    </div>
                }
                <List>
                    {this.props.groups && this.props.groups.map(data => (
                        <ListItem className={this.styleSelectedGroup(data.url)} button key={data.id}
                                  onClick={(event => this.redirectToGroup(event, data.id, data.url))}>
                            <Avatar>
                                <FolderIcon/>
                            </Avatar>
                            <ListItemText
                                style={{marginLeft: "5px"}}
                                primary={
                                    <React.Fragment>
                                        <span className={this.styleUnreadMessage(data.lastMessageSeen)}>
                                            {data.name}
                                        </span>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <span
                                            className={this.styleUnreadMessage(data.lastMessageSeen) + " group-subtitle-color"}
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
            </div>
        )
    }
}

export default withRouter(SidebarGroups);