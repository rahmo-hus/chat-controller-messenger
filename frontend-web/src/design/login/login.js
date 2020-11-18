import React, {Component} from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockIcon from '@material-ui/icons/Lock';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";
import {generateColorMode, generateIconColorMode, generateLinkColorMode} from "../style/enable-dark-mode";
import {Link, withRouter} from "react-router-dom";
import CustomTextField from "../partials/custom-material-textfield";
import Toaster from "../utils/toaster";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",

            // Toaster props
            snackBarOpened: false,
            snackBarText: "",
            severity: null
        }
        this.submitLogin = this.submitLogin.bind(this);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        switch (e.target.name) {
            case "username":
                this.setState({username: e.target.value});
                break;
            case "password":
                this.setState({password: e.target.value});
                break;
            default:
                throw Error("OUPSI");
        }
    }

    login(username, password) {
        console.log("Authentication in progress...");
        AuthService.authenticate(username, password).then(res => {
            if (res.status === 200 && res.data && res.data.token) {
                localStorage.setItem("authorization", JSON.stringify(res.data));
                console.log("Success");
                this.setState({snackBarOpened: true, snackBarText: "You are connected !", severity: "info"})
                this.props.setUserAuthenticated(true);
                this.props.history.push({
                    pathname: "/",
                    openToaster: true,
                    text: "Your are connected ! Welcome back " + username + " !",
                    severity: "success"
                });
            }
        }).catch(error => {
            this.props.setUserAuthenticated(false);
            this.setState({
                snackBarOpened: true,
                snackBarText: "Error : bad credentials",
                severity: "error",
                username: "",
                password: ""
            })
            if (error.response === undefined) {
                console.log("No response received from server");
            } else {
                console.log("Fail !");
            }
        });
    }

    submitLogin(event) {
        if (event.key === undefined || event.key === 'Enter') {
            if (!this.state.username || !this.state.password) {
                this.setState({error: true});
                return;
            }
            this.login(this.state.username, this.state.password)
        }
    }

    render() {
        return (
            <div className={generateColorMode(this.props.isDarkModeEnable)}
                 style={{height: "calc(100% - 64px)", width: "100%"}}>
                <div className={"main-register-form"}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <LockIcon fontSize={"large"}
                                  className={generateIconColorMode(this.props.isDarkModeEnable)}/>
                    </div>
                    <Typography component="h1" variant="h5">
                        S'identifier
                    </Typography>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextField id={"loginUsernameInput"} label={"Username"}
                                                 name={"username"}
                                                 handleChange={this.handleChange}
                                                 type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField id={"loginPasswordInput"} label={"Password"}
                                                 name={"password"}
                                                 handleChange={this.handleChange}
                                                 type={"password"}
                                                 keyUp={this.submitLogin}
                                                 isDarkModeEnable={this.props.isDarkModeEnable}/>
                            </Grid>
                        </Grid>
                        <div>
                            <Grid item xs={12}>
                                <Button
                                    className={"button-register-form"}
                                    style={{marginTop: "15px"}}
                                    onClick={(event) => this.submitLogin(event)}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Valider
                                </Button>
                            </Grid>
                        </div>
                        <Grid container
                              direction="row"
                              justify="space-between">
                            <Link className={"lnk"}
                                  style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}}
                                  to={"/forgetpassword"}>
                                Mot de passe oublié ?
                            </Link>
                            <Link className={"lnk"}
                                  style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}}
                                  to={"/register"}>
                                S'enregistrer
                            </Link>
                        </Grid>
                    </div>
                    <Box mt={5}>
                        <Typography variant="body2" color="inherit" align="center">
                            {'Copyright © '}
                            <Link to="/" className={"lnk"}
                                  style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}}>
                                Software Technologies
                            </Link>{' '}
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Box>
                </div>
                <Toaster toasterOpened={this.state.snackBarOpened} text={this.state.snackBarText}
                         severity={this.state.severity}/>
            </div>
        )
    }
}

export default withRouter(Login);