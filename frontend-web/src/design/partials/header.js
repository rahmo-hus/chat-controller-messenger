import React, {Component} from "react";
import {Link as RouterLink, withRouter} from "react-router-dom"
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {generateColorMode} from "../style/enable-dark-mode";
import Toaster from "../utils/toaster";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameLoggedIn: null,
            isDarkMode: true,
            authenticated: null,
            isComponentMounted: false,
            snackBarOpened: false,
        };
        this.logoutUser = this.logoutUser.bind(this);
    }

    toggleDarkMode() {
        this.setState(prevState => {
            return {
                isDarkMode: !prevState.isDarkMode
            }
        }, () => {
            this.props.toggleDarkMode(this.state.isDarkMode);
        });
    }

    componentDidMount() {
        this.props.toggleDarkMode(this.state.isDarkMode);
        AuthService.testRoute().then(r => {
            if (r.status === 200) {
                this.setState({authenticated: true}, () => {
                    this.setState({isComponentMounted: true, usernameLoggedIn: r.data.firstName})
                    this.props.setUserAuthenticated(true)
                });
            }
        }).catch(err => {
            this.props.setUserAuthenticated(false);
            this.setState({authenticated: false})
        });
    }

    logoutUser() {
        localStorage.removeItem("authorization");
        this.setState({authenticated: false, snackBarOpened: true})
        this.props.setUserAuthenticated(false);
        this.props.history.push({
            pathname: "/",
            openToaster: true,
            text: "You have successfully logged out",
            severity: "info"
        });
    }

    render() {
        return (
            <div className={generateColorMode(this.state.isDarkMode)}>
                <Toolbar className={"clrcstm"}
                         style={{flexWrap: "wrap", boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                    <Typography variant="h6" style={{flexGrow: "1"}}>
                        <RouterLink className={"lnk clrcstm"} to={"/"}>
                            Software
                        </RouterLink>
                    </Typography>
                    <nav className={"lnk clrcstm"}>
                        {
                            this.props.authenticated &&
                            <RouterLink className={"lnk clrcstm"} to={"/t/messages"}>
                                <Button className={"clrcstm"} variant="outlined"
                                        style={{margin: "8px 12px"}}>
                                    Messages
                                </Button>
                            </RouterLink>
                        }
                        {
                            !this.props.authenticated &&
                            <RouterLink className={"lnk clrcstm"} to={"/login"}>
                                <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                    Login
                                </Button>
                            </RouterLink>
                        }
                        {
                            !this.props.authenticated &&
                            <RouterLink className={"lnk clrcstm"} to={"/register"}>
                                <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                    Register
                                </Button>
                            </RouterLink>
                        }
                        {
                            this.props.authenticated &&
                            <RouterLink className={"lnk clrcstm"} to={"#"}>
                                <Button className={"clrcstm"} variant="outlined" onClick={this.logoutUser}
                                        style={{margin: "8px 12px"}}>
                                    Logout
                                </Button>
                            </RouterLink>
                        }
                        {
                            this.props.authenticated &&
                            <RouterLink className={"lnk clrcstm"} to={"/create"}>
                                <Button className={"clrcstm"} variant="outlined"
                                        style={{margin: "8px 12px"}}>
                                    Create group
                                </Button>
                            </RouterLink>
                        }
                        {
                            this.props.usernameLoggedIn &&
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                {this.state.usernameLoggedIn}
                            </Button>
                        }
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.isDarkMode}
                                    onChange={event => this.toggleDarkMode(event)}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label={
                                this.state.isDarkMode ? "Dark " : "Light"
                            }
                        />
                    </nav>
                </Toolbar>
                <Toaster toasterOpened={this.state.snackBarOpened} text={"You are successfully disconnected"}
                         severity={"info"}/>
            </div>

        )
    }
}

export default withRouter(Header);
