import React, {Component} from "react";
import AppBar from "@material-ui/core/AppBar";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom"
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";

class Header extends Component {

    testRoute(e) {
        e.preventDefault();
        AuthService.testRoute().then(r => {
            console.log(r)
        })
    }

    render() {
        return (
            <AppBar color="default"
                    style={{position: "relative", zIndex: "10000"}}>
                <Toolbar style={{flexWrap: "wrap"}}>
                    <Typography variant="h6" color="inherit" noWrap style={{flexGrow: "1"}}>
                        <RouterLink to={"/"}>
                            Software
                        </RouterLink>
                    </Typography>
                    <nav>
                        <RouterLink to={"/t/messages"}>
                            <Button variant="outlined" style={{margin: "8px 12px"}}>
                                Messages
                            </Button>
                        </RouterLink>
                        <Link onClick={(e) => this.testRoute(e)} variant="button" color="textPrimary" href="#"
                              style={{margin: "8px 12px"}}>
                            Routing
                        </Link>
                        <RouterLink to={"/login"}>
                            <Button variant="outlined" style={{margin: "8px 12px"}}>
                                Login
                            </Button>
                        </RouterLink>
                        <RouterLink to={"/register"}>
                            <Button variant="outlined" style={{margin: "8px 12px"}}>
                                Register
                            </Button>
                        </RouterLink>
                    </nav>
                </Toolbar>
            </AppBar>

        )
    }
}

export default Header;
