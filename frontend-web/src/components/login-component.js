import React, {useState} from "react";
import {generateIconColorMode, generateLinkColorMode} from "../design/style/enable-dark-mode";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CustomTextField from "../design/partials/custom-material-textfield";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Box from "@material-ui/core/Box";
import AuthService from "../service/auth-service";
import {setWsUserToken, userAuthenticated} from "../actions";
import {useHistory} from "react-router-dom";
import {Toaster} from "../utils/alert-snackbar";

const LoginComponent = ({isDarkModeToggled, currentThemeMode, dispatch}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alertOpened, setAlertOpened] = useState(false);
    const history = useHistory();

    function handleChange(e) {
        e.preventDefault();
        switch (e.target.name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            default:
                throw Error("Whoops ! Something went wrong...");
        }
    }

    function submitLogin(event) {
        if (event.key === undefined || event.key === 'Enter') {
            if (!username || !password) {
                return;
            }
            login(username, password)
        }
    }

    function login() {
        AuthService.authenticate(username, password).then(function (res) {
                if (res.status === 200) {
                    // localStorage.setItem("_cAG", res.data.groupSet[0].url)
                    dispatch(userAuthenticated(res.data))
                    dispatch(setWsUserToken(res.data.wsToken))
                    history.push("/");
                }
            }
        ).catch(err => {
            setUsername("");
            setPassword("");
            setAlertOpened(true)
                // snackBarText
            console.log(err)
        })
    }

    return (
        <div className={currentThemeMode}
             style={{height: "calc(100% - 64px)", width: "100%"}}>
            <div className={"main-register-form"}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <LockIcon fontSize={"large"}
                              className={generateIconColorMode(isDarkModeToggled)}
                    />
                </div>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CustomTextField id={"loginUsernameInput"}
                                             label={"Username"}
                                             name={"username"}
                                             value={username}
                                             isDarkModeEnable={isDarkModeToggled}
                                             handleChange={handleChange}
                                             type={"text"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField id={"loginPasswordInput"}
                                             label={"Password"}
                                             name={"password"}
                                             value={password}
                                             isDarkModeEnable={isDarkModeToggled}
                                             handleChange={handleChange}
                                             type={"password"}
                                             keyUp={submitLogin}
                            />
                        </Grid>
                    </Grid>
                    <div>
                        <Grid item xs={12}>
                            <Button
                                className={"button-register-form"}
                                style={{marginTop: "15px"}}
                                onClick={(event) => submitLogin(event)}
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
                              style={{color: generateLinkColorMode(isDarkModeToggled)}}
                              to={"/forgetpassword"}>
                            Mot de passe oublié ?
                        </Link>
                        <Link className={"lnk"}
                              style={{color: generateLinkColorMode(isDarkModeToggled)}}
                              to={"/register"}>
                            S'enregistrer
                        </Link>
                    </Grid>
                </div>
                <Box mt={5}>
                    <Typography variant="body2" color="inherit" align="center">
                        {'Copyright © '}
                        <Link to="/" className={"lnk"}
                              style={{color: generateLinkColorMode(isDarkModeToggled)}}
                        >
                            Software Technologies
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </div>
            <Toaster toasterOpened={alertOpened} text={"Error : bad credentials"}
                     severity={"error"}/>
        </div>
    )
}

export default LoginComponent;
