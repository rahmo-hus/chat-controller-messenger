import React, {Component} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import ErrorIcon from '@material-ui/icons/Error';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {Link, withRouter} from "react-router-dom";
import {generateColorMode, generateLinkColorMode} from "../style/enable-dark-mode";
import "./websocketStyle.css";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import AllUsersDialog from "../dialog/all-users-dialog";
import AuthService from "../../service/auth-service";
import {TypeGroupEnum} from "../../utils/type-group-enum";

let groupEventListener = null;

class SidebarGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupOpen: false
        }
        this.handleAddUserAction = this.handleAddUserAction.bind(this);
        this.createConversation = this.createConversation.bind(this);
    }

    redirectToGroup(event, groupId, groupURL) {
        event.preventDefault();
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

    handleAddUserAction(action) {
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

    createConversation(event, id) {
        event.preventDefault();
        if (this.props.ws !== null || undefined) {
            console.log("Create conv !")
            console.log(this.props.userId)
            if (this.props.userId === null) {
                return;
            }
            // this.props.ws.publish({
            //     destination: "/app/groups/create/single",
            //     body: JSON.stringify({id1: this.props.userId, id2: id})
            // });
            let enc = new TextEncoder();
            let data = enc.encode("Bonjour Thibaut ça va mon gars ?")
            console.log(enc.encode("This is a super message in Ui8Array"))
            this.props.ws.publish({
                destination: "/app/groups/create/single",
                binaryBody: data,
            });
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

                <Collapse in={this.props.wsError}>
                    <Alert severity="error">
                        Application is currently unavailable
                    </Alert>
                </Collapse>

                <div style={{marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <span style={{marginLeft: "10px", fontSize: "20px", fontWeight: "bold"}}>
                        Discussions
                    </span>
                    <div>
                        <IconButton onClick={() => this.handleAddUserAction("open")}>
                            <AddCircleIcon fontSize={"large"}/>
                        </IconButton>
                    </div>
                </div>
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
                <AllUsersDialog closeDialog={this.handleAddUserAction}
                                doUserDialogAction={this.createConversation}
                                open={this.state.popupOpen}
                                dialogTitleText={"Start conversation with someone"}/>
            </div>
        )
    }
}

export default withRouter(SidebarGroups);