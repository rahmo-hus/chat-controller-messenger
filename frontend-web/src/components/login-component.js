import React, {useState} from "react";
import {generateIconColorMode, generateLinkColorMode} from "../design/style/enable-dark-mode";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CustomTextField from "../design/partials/custom-material-textfield";
import Button from "@material-ui/core/Button";
import {Link, useHistory} from "react-router-dom";
import Box from "@material-ui/core/Box";
import AuthService from "../service/auth-service";
import {Toaster} from "../utils/alert-snackbar";
import {setWsUserToken, userAuthenticated} from "../actions";

const LoginComponent = ({isDarkModeToggled, currentThemeMode, dispatch}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [alertOpened, setAlertOpened] = useState(false);
    const [authStepOneSuccess, setAuthStepOneSuccess] = useState(false);
    const [authParameters, setAuthParameters] = useState({});
    const history = useHistory();

    function handleChange(e) {
        e.preventDefault();
        console.log(e.target.name)
        switch (e.target.name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            case "verification-code":
                setVerificationCode(e.target.value);
                break;
            default:
                throw Error("Whoops ! Something went wrong...");
        }
    }

    function readFileDataAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsDataURL(file);
        });
    }

    function submitLoginStepOne(event) {
        event.preventDefault();
        if (event.key === undefined || event.key === 'Enter') {
            if (!username || !password || !certificate) {
                return;
            }
            login(username, password)
        }
    }

    function submitLoginStepTwo(event) {
        if (event.key === undefined || event.key === 'Enter') {
            if (!verificationCode) {
                return;
            }
            verify(username, verificationCode);
        }
    }

    function verify(username, verificationCode){
        AuthService.verify(username, verificationCode).then((res)=>{
            if(res.status === 200){
                dispatch(userAuthenticated(res.data));
                dispatch(setWsUserToken(res.data.wsToken));
                history.push("/");
            }
        }).catch(err =>{
            setAlertOpened(true);
        });
    }


    function selectFile(event) {
        readFileDataAsBase64(event.target.files[0]).then(res => {
            setCertificate(res);
            setFileName((event.target.files[0]).name);
        }).catch(err =>{
            console.log(err);
        });
    }

    function login() {
        AuthService.authenticate(username, password, certificate).then(function (res) {
                if (res.status === 200) {
                    // localStorage.setItem("_cAG", res.data.groupSet[0].url)
                    //dispatch(userAuthenticated(res.data));
                    //dispatch(setWsUserToken(res.data.wsToken));
                    setAuthStepOneSuccess(true);
                    //history.push("/");
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
                {!authStepOneSuccess ?
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
                                                 keyUp={submitLoginStepOne}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label htmlFor="certificate-input">
                                    <input
                                        id="certificate-input"
                                        name="certificate-input"
                                        style={{display: 'none'}}
                                        type="file"
                                        accept=".csr,.crt,.pem,.cer"
                                        onChange={selectFile}
                                    />
                                    <Button
                                        className="btn-choose"
                                        variant="outlined"
                                        color="secondary"
                                        component="span">
                                        Choose Certificate
                                    </Button>
                                    {fileName && " " + fileName}
                                </label>
                            </Grid>
                        </Grid>
                        <div>
                            <Grid item xs={12}>
                                <Button
                                    className={"button-register-form"}
                                    style={{marginTop: "15px"}}
                                    onClick={(event) => submitLoginStepOne(event)}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Proceed to next authentication step
                                </Button>
                            </Grid>
                        </div>
                        <Grid container
                              direction="row"
                              justify="center">
                            <Link className={"lnk"}
                                  style={{color: generateLinkColorMode(isDarkModeToggled)}}
                                  to={"/register"}>
                                Register
                            </Link>
                        </Grid>
                    </div>
                    :
                    <div>
                        <Grid container
                              spacing={2}
                              direction="column">
                            <Grid item xs={12}>
                                <CustomTextField id={"verification-code-input"}
                                                 label={"Verification code"}
                                                 name={"verification-code"}
                                                 value={verificationCode}
                                                 isDarkModeEnable={isDarkModeToggled}
                                                 handleChange={handleChange}
                                                 type={"text"}/>
                            </Grid>
                        </Grid>
                        <div>
                            <Grid item xs={12}>
                                <Button
                                    className={"button-register-form"}
                                    style={{marginTop: "15px"}}
                                    onClick={(event) => submitLoginStepTwo(event)}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Login
                                </Button>
                            </Grid>
                        </div>
                    </div>
                }
                <Box mt={5}>
                    <Typography variant="body2" color="inherit" align="center">
                        {'Copyright © '}
                        <Link to="/" className={"lnk"}
                              style={{color: generateLinkColorMode(isDarkModeToggled)}}
                        >
                            ETFBL
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </div>
            <Toaster toasterOpened={authStepOneSuccess}
                     text={"Credentials and certificate are valid. Now enter verification code sent to your email."}
                     severity={"success"}/>
            <Toaster toasterOpened={alertOpened} text={"Error : bad credentials"}
                     severity={"error"}/>
        </div>
    )
}

export default LoginComponent;
