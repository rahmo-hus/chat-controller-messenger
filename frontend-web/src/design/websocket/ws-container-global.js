import React, {Component} from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import AuthService from "../../service/auth-service";
import {Link, withRouter} from "react-router-dom";
import WebSocketContainer from "./websocket-container";

class WsContainerGlobal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: null,
            userId: null
        }
    }

    componentDidMount() {
        AuthService.fetchUserInformation().then(r => {
            if (r.data.length !== 0) {
                this.setState({userId: r.data.id});
                this.setState({groups: r.data.groupSet}, () => {
                    this.props.history.push({
                        pathname: `/t/messages/${this.state.groups[0].url}`,
                        userId: r.data.id,
                        groupId: r.data.groupSet[0].id
                    })
                });
            }
        })
    }

    render() {
        const isUrlActive = this.props.location && this.props.location.pathname.split("/").slice(-1)[0] === "messages";
        return (
            <div>
                <Drawer variant="permanent">
                    <div
                        style={{width: "240px"}}>
                        <div style={{minHeight: "64px"}}/>
                        <List>
                            {this.state.groups && this.state.groups.map(data => (
                                <ListItem button key={data.id}>
                                    <Avatar>
                                        <FolderIcon/>
                                    </Avatar>
                                    <Link to={{
                                        pathname: `/t/messages/${data.url}`,
                                        groupId: data.id,
                                        userId: this.state.userId,
                                        history: this.props.history
                                    }}>
                                        <ListItemText style={{marginLeft: "5px"}} primary={data.name}/>
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
                {
                    !isUrlActive && <WebSocketContainer {...this.props}/>
                }
            </div>
        )
    }
}

export default withRouter(WsContainerGlobal);