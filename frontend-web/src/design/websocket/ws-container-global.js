import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import WebSocketContainer from "./websocket-container";
import {initWebSocket} from "../../config/websocket-config";
import SidebarGroupActions from "./sidebar-group-actions";
import SidebarGroups from "./sidebar-groups";
import {buildUserToken, getUserToken} from "../../config/user-token";
import {generateColorMode} from "../style/enable-dark-mode";
import AuthService from "../../service/auth-service";
import {playNotificationSound} from "../../config/play-sound-notification";


let client = null;

class WsContainerGlobal extends Component {
    activate = false;

    constructor(props) {
        super(props);
        this.state = {
            isComponentMounted: false,
            groups: null,
            userId: null,
            ws: null
        };
        this.updateLastMessageInGroups = this.updateLastMessageInGroups.bind(this);
    }

    /**
     * Update groups sidebar with new messages
     * @param value
     */
    updateLastMessageInGroups(value) {
        let groupToUpdateIndex = this.state.groups.findIndex(elt => elt.id === value.groupId)
        let groupsArray = [...this.state.groups];
        let item = {...groupsArray[groupToUpdateIndex]};
        item.lastMessage = value.message;
        item.lastMessageDate = value.lastMessageDate;
        item.lastMessageSeen = true;
        groupsArray[groupToUpdateIndex] = item;
        this.setState({groups: groupsArray}, () => {
            playNotificationSound();
        });
    }

    connect() {
        const token = getUserToken();
        client = initWebSocket(token);
        this.setState({ws: client});
        client.onConnect = function (frame) {
            client.subscribe("/user/queue/reply", (res) => {
                const data = JSON.parse(res.body);
                this.setState({groups: data.groupSet, userId: data.id, groupUrl: data.groupSet[0].url}, () => {
                    this.props.history.push({
                        pathname: `/t/messages/${this.state.groups[0].url}`,
                        groupUrl: this.state.groupUrl,
                        userId: this.state.userId
                    });
                    this.activate = !this.activate;
                })
            });
            client.publish({destination: "/app/message", body: buildUserToken()});
        }.bind(this);

        client.onStompError = function (frame) {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        client.onDisconnect((fr) => {
            console.log(fr)
        })
        client.activate();
    }

    componentDidMount() {
        AuthService.testRoute().then(r => {
            if (r.status === 200) {
                this.connect();
                this.setState({isComponentMounted: true})
            }
        }).catch(err => {
            this.setState({isComponentMounted: true}, () => {
                this.props.history.push("/login");
            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.activate = !this.activate;
        }
    }

    componentWillUnmount() {
        if (client !== null || undefined) {
            console.log("CLOSING WEBSOCKET")
            client.deactivate();
        }
    }


    render() {
        return (
            <div className={generateColorMode(this.props.isDarkModeEnable)}
                 style={{height: "calc(100% - 64px)", display: "flex", justifyContent: "space-between"}}>
                <SidebarGroups ws={this.state.ws}
                               userId={this.state.userId}
                               isDarkModeEnable={this.props.isDarkModeEnable}
                               activate={this.activate}
                               groups={this.state.groups}
                               updateLastMessageInGroups={this.updateLastMessageInGroups}/>
                <WebSocketContainer ws={this.state.ws}
                                    isDarkModeEnable={this.props.isDarkModeEnable}
                                    activate={this.activate}
                                    userId={this.state.userId}
                                    groupUrl={this.state.groupUrl}/>
                <SidebarGroupActions ws={this.state.ws}
                                     isDarkModeEnable={this.props.isDarkModeEnable}
                                     activate={this.activate}
                                     groupUrl={this.state.groupUrl}/>
            </div>
        )
    }
}

export default withRouter(WsContainerGlobal);