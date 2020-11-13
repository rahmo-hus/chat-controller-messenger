import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {Link, withRouter} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import AuthService from "../../service/auth-service";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import "./register-form.css";
import {generateColorMode, generateIconColorMode, generateLinkColorMode} from "../style/enable-dark-mode";
import CustomTextField from "../partials/custom-material-textfield";

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
        this.state = {
            username: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",

            noMatchPasswordsError: false,
            displayNoMatchPasswordsError: false,
            isEmailNotValid: false,
            displayEmailNotValid: false,
            formValidationError: false,
            displayFormValidationError: false,
            formError: []
        };
        this.handleChange = this.handleChange.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    errorArray = [];

    checkFormValidation() {
        if (this.state.username === "") {
            this.errorArray.push("Username is required")
        }
        if (this.state.lastName === "") {
            this.errorArray.push("Last name is required")
        }
        if (this.state.isEmailNotValid) {
            this.errorArray.push("Email is not valid")
        }
        if (this.state.password === "") {
            this.errorArray.push("Password is required")
        }
        if (this.state.repeatPassword === "") {
            this.errorArray.push("Please type again your password")
        }
        if (this.state.noMatchPasswordsError) {
            this.errorArray.push("Passwords does not match")
        }
    }

    registerUser(e) {
        e.preventDefault();
        this.errorArray = [];
        this.checkFormValidation()
        if (this.errorArray.length === 0) {
            console.log("Registering user ...")
            AuthService.createUser(this.state.username, this.state.lastName, this.state.email, this.state.password).then(r => {
                this.props.history.push({
                    pathname: "/",
                    openToaster: true,
                    text: "Your account has been created ! Welcome " + this.state.username + " !",
                    severity: "success"
                })
            }).catch(e => {
                console.log(e.response)
                console.log("Error during registration : ", e.message)
                this.errorArray.push(e.response.data);
                this.setState({displayFormValidationError: true})

            })
        } else {
            this.setState({formValidationError: true});
            this.setState({displayFormValidationError: true});
        }

    }

    clearFields() {
        this.setState({
            username: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",
        });
    }

    validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }

    closeAlert(e, code) {
        e.preventDefault();
        switch (code) {
            case "arrayErrors":
                this.setState({displayFormValidationError: false})
                break
            case "email":
                this.setState({displayEmailNotValid: false})
                break
            case "repeatPassword":
                this.setState({displayNoMatchPasswordsError: false})
                break
            default:
                throw new Error("Merde")
        }
    }

    handleChange(e) {
        e.preventDefault();
        switch (e.target.name) {
            case "firstName":
                this.setState({username: e.target.value});
                break
            case "lastName":
                this.setState({lastName: e.target.value});
                break
            case "email":
                this.setState({displayEmailNotValid: true})
                this.setState({isEmailNotValid: true})
                this.setState({email: e.target.value});
                if (this.validateEmail(this.state.email)) {
                    this.setState({isEmailNotValid: false})
                    this.setState({displayEmailNotValid: false})
                }
                break
            case "password":
                this.setState({password: e.target.value});
                break
            case "repeatPassword":
                this.setState({repeatPassword: e.target.value}, () => {
                        if (this.state.password !== this.state.repeatPassword) {
                            this.setState({noMatchPasswordsError: true})
                            this.setState({displayNoMatchPasswordsError: true})
                        } else {
                            this.setState({noMatchPasswordsError: false})
                            this.setState({displayNoMatchPasswordsError: false})
                        }
                    }
                );
                break
            default:
                throw Error;
        }
    }

    render() {
        return (
            <div className={generateColorMode(this.props.isDarkModeEnable)}
                 style={{height: "calc(100% - 64px)", width: "100%"}}>
                <div className={"main-register-form"}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <AccountCircleIcon fontSize={"large"}
                                           className={generateIconColorMode(this.props.isDarkModeEnable)}/>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                    </div>
                    <form style={{marginTop: "24px"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {
                                    <Collapse ref={this.wrapper} in={this.state.displayFormValidationError}
                                              timeout={500}>
                                        <Alert action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={(e) => this.closeAlert(e, "arrayErrors")}
                                            >
                                                <CloseIcon fontSize="inherit"/>
                                            </IconButton>
                                        } severity="warning">
                                            <ul>
                                                {this.errorArray ? this.errorArray.map((error, index) => (
                                                        <li key={index}>
                                                            {error}
                                                        </li>
                                                    ))
                                                    :
                                                    <li/>}
                                            </ul>
                                        </Alert>
                                    </Collapse>
                                }
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField id={"firstNameInput"} label={"First Name"} name={"firstName"}
                                                 value={this.state.username}
                                                 handleChange={this.handleChange}
                                                 type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField id={"lastNameInput"} label={"Last Name"} name={"lastName"}
                                                 value={this.state.lastName}
                                                 handleChange={this.handleChange}
                                                 type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField id={"emailInput"} label={"Email Address"} name={"email"}
                                                 value={this.state.email}
                                                 handleChange={this.handleChange}
                                                 type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                                {
                                    <Collapse in={this.state.displayEmailNotValid} timeout={1500}>
                                        <Alert action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={(e) => this.closeAlert(e, "email")}
                                            >
                                                <CloseIcon fontSize="inherit"/>
                                            </IconButton>
                                        } severity="warning">Email is not valid</Alert>
                                    </Collapse>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField id={"passwordInput"} label={"Password"} name={"password"}
                                                 handleChange={this.handleChange}
                                                 value={this.state.password}
                                                 type={"password"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField id={"repeatPasswordInput"} label={"Repeat password"}
                                                 name={"repeatPassword"}
                                                 handleChange={this.handleChange}
                                                 value={this.state.repeatPassword}
                                                 type={"password"} isDarkModeEnable={this.props.isDarkModeEnable}/>
                                {
                                    <Collapse in={this.state.displayNoMatchPasswordsError} timeout={1500}>
                                        <Alert action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={(e) => this.closeAlert(e, "repeatPassword")}
                                            >
                                                <CloseIcon fontSize="inherit"/>
                                            </IconButton>
                                        } severity="error">Passwords does not match</Alert>
                                    </Collapse>
                                }
                            </Grid>
                        </Grid>
                        <div style={{marginTop: "10px"}}>
                            <Button
                                className={"button-register-form"}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(e) => this.registerUser(e)}
                            >
                                Sign Up
                            </Button>
                        </div>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link className={"lnk"}
                                      style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}}
                                      to={"/sign_in"} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Typography variant="body2" color="inherit" align="center">
                        {'Copyright © '}
                        <Link style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}} className={"lnk"}
                              color="inherit" to="/">
                            RS Software
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </div>
        );
    }
}

export default withRouter(RegisterForm);