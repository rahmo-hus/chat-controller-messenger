import React, {Component} from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import AuthService from "../../service/auth-service";
import {Link} from "react-router-dom";

class SidebarGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: null
        }
    }


    componentDidMount() {
        AuthService.fetchUserInformation().then(r => {
            if (r.data.length !== 0) {
                this.setState({groups: r.data});
            }
        })
    }


    render() {
        return (
            <Drawer variant="permanent">
                <div
                    style={{width: "240px"}}>
                    <div style={{minHeight: "64px"}}/>
                    <List>
                        {this.state.groups && this.state.groups.map((data) => (
                            <ListItem button key={data.id}>
                                <Avatar>
                                    <FolderIcon/>
                                </Avatar>
                                <Link to={{
                                    pathname: `/t/messages/${data.url}`,
                                    groupId: data.id
                                }}>
                                    <ListItemText style={{marginLeft: "5px"}} primary={data.name}/>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        )
    }
}

export default SidebarGroups