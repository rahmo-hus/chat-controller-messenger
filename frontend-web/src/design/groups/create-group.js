import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";
import {generateColorMode} from "../style/enable-dark-mode";

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: "",
        }
        this.groupNameConstructor = this.groupNameConstructor.bind(this);
        this.createGroup = this.createGroup.bind(this);
    }

    createGroup(event) {
        event.preventDefault();
        AuthService.createGroup(this.state.groupName).then(r => {
            console.log(r.status)
        }).catch(err => {
            console.log(err)
        })
    }

    groupNameConstructor(event) {
        let value = event.target.value;
        this.setState({groupName: value});
    }


    render() {
        return (
            <div className={generateColorMode(this.props.isDarkModeEnable)}
                 style={{height: "calc(100% - 64px)", textAlign: "center", paddingTop: "40px"}}>
                <Container className={"clrcstm"} component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={"main-register-form clrcstm"}>
                        <Typography className={"clrcstm"} variant="h6">
                            Créer un groupe
                        </Typography>
                    </div>
                    <div className={"clrcstm"}>
                        <Grid className={"clrcstm"} container spacing={2}>
                            <Grid className={"clrcstm"} item xs={12}>
                                <TextField
                                    id="username"
                                    name="username"
                                    variant="outlined"
                                    required
                                    value={this.state.groupName}
                                    onChange={(event) => this.groupNameConstructor(event)}
                                    fullWidth
                                    label={"Username"}
                                    autoFocus
                                />
                            </Grid>
                            <div>
                                <Grid item xs={12}>
                                    <Button
                                        className={"button-register-form"}
                                        style={{marginTop: "15px"}}
                                        onClick={(event) => this.createGroup(event)}
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Valider
                                    </Button>
                                </Grid>
                            </div>
                        </Grid>
                    </div>
                </Container>
            </div>
        )
    }
}

export default CreateGroup;