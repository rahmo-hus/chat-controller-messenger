import React, {useEffect} from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Link as RouterLink, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import AuthService from "../service/auth-service";

export const HeaderComponent = ({
                                    initUserData,
                                    changeThemeMode,
                                    userLogout,
                                    isDarkModeToggled,
                                    currentThemeMode,
                                    isUserLoggedIn,
                                    usernameLoggedIn
                                }) => {
    const history = useHistory();

    useEffect(() => {
        initUserData()
    }, [initUserData])


    function dispatchLogout(event) {
        event.preventDefault();
        AuthService.logout().then(() => {
            userLogout();
            localStorage.removeItem("_cAG");
            history.push("/");
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className={currentThemeMode}>
            <Toolbar className={"clrcstm"}
                     style={{flexWrap: "wrap", boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                <Typography variant="h6" style={{flexGrow: "1"}}>
                    <RouterLink className={"lnk clrcstm"} to={"/"}>
                        Messenger
                    </RouterLink>
                </Typography>
                <nav className={"lnk clrcstm"}>
                    {
                        isUserLoggedIn &&
                        <RouterLink className={"lnk clrcstm"} to={"/t/messages/"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Messages
                            </Button>
                        </RouterLink>
                    }
                    {
                        !isUserLoggedIn &&
                        <RouterLink className={"lnk clrcstm"} to={"/login"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Login
                            </Button>
                        </RouterLink>
                    }
                    {
                        !isUserLoggedIn &&
                        <RouterLink className={"lnk clrcstm"} to={"/register"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Register
                            </Button>
                        </RouterLink>
                    }
                    {
                        isUserLoggedIn &&
                        <RouterLink className={"lnk clrcstm"} to={"/create"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Create group
                            </Button>
                        </RouterLink>
                    }

                    {
                        usernameLoggedIn !== null &&
                        <Button className={"clrcstm"} variant="outlined" disabled
                                style={{margin: "8px 12px"}}>
                            {usernameLoggedIn}
                        </Button>
                    }

                    {
                        isUserLoggedIn &&
                        <RouterLink className={"lnk clrcstm"} to={"#"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    onClick={(event) => dispatchLogout(event)}
                                    style={{margin: "8px 12px"}}>
                                Logout
                            </Button>
                        </RouterLink>
                    }
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkModeToggled}
                                onChange={() => changeThemeMode()}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label={
                            isDarkModeToggled ? "Dark " : "Light"
                        }
                    />

                </nav>
            </Toolbar>
        </div>
    )
}