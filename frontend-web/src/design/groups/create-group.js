import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";
import {generateColorMode} from "../style/enable-dark-mode";
import CustomTextField from "../partials/custom-material-textfield";
import {withRouter} from "react-router-dom";

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: "",
        }
        this.createGroup = this.createGroup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitGroupCreation = this.submitGroupCreation.bind(this);
    }

    createGroup(event) {
        event.preventDefault();
        AuthService.createGroup(this.state.groupName).then(r => {
            this.props.history.push({
                pathname: "/t/messages"
            })
        }).catch(err => {
            console.log(err)
        })
    }

    submitGroupCreation(event) {
        if (event.key === undefined || event.key === 'Enter') {
            if (this.state.groupName === "") {
                return;
            }
            this.createGroup(event)
        }
    }


    handleChange(event) {
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
                            Create a gruop
                        </Typography>
                    </div>
                    <div className={"clrcstm"}>
                        <Grid className={"clrcstm"} container spacing={2}>
                            <Grid className={"clrcstm"} item xs={12}>
                                <CustomTextField id={"createGroupMessenger"}
                                                 label={"Type a name for your group"}
                                                 name={"groupName"}
                                                 handleChange={this.handleChange}
                                                 type={"text"}
                                                 keyUp={this.submitGroupCreation}
                                                 isDarkModeEnable={this.props.isDarkModeEnable}/>
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
                                        Validate
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

export default withRouter(CreateGroup);