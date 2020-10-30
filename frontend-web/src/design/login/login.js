import React, {Component} from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
        this.submitLogin = this.submitLogin.bind(this);
        this.login = this.login.bind(this);
    }

    usernameConstructor(event) {
        let value = event.target.value;
        this.setState({username: value});
    }

    passwordConstructor(event) {
        let value = event.target.value;
        this.setState({password: value});
    }

    login(username, password) {
        console.log("Authentication in progress...");
        AuthService.authenticate(username, password).then(res => {
            if (res.status === 200 && res.data && res.data.token) {
                localStorage.setItem("authorization", JSON.stringify(res.data));
                console.log("Success")
            } else {
                console.log("Fail");
            }
        }).catch(error => {
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
            <div style={{textAlign: "center", marginTop: "40px"}}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={"main-register-form"}>
                        <Typography component="h1" variant="h5">
                            S'identifier
                        </Typography>
                    </div>
                    <div>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="username"
                                        name="username"
                                        variant="outlined"
                                        required
                                        value={this.state.username}
                                        onChange={(event) => this.usernameConstructor(event)}
                                        fullWidth
                                        label={"Username"}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="password"
                                        label={"Password"}
                                        name="password"
                                        type={"password"}
                                        value={this.state.password}
                                        onKeyDown={(event) => this.submitLogin(event)}
                                        onChange={(event) => this.passwordConstructor(event)}
                                    />
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
                            <Grid container>
                                <Grid item xs>
                                    <Link variant="body2" to={"/forgetpassword"}>
                                        {/*{t("login.forgotPassword")}*/}
                                        Mot de passe oublié ?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link className={"jsLink"} to={"/sign_up"}>
                                        S'enregistrer
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'Copyright © '}
                            <Link to="/" color="inherit">
                                Software Technologies
                            </Link>{' '}
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Box>
                </Container>
            </div>
        )
    }
}

export default Login;