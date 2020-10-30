import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link, withRouter} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AuthService from "../../service/auth-service";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
        this.state = {
            username: "",
            lastName: "",
            email: "",
            password: "root",
            repeatPassword: "root",

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
        console.log(this.errorArray.length)
        if (this.errorArray.length === 0) {
            console.log("Registering user ...")
            AuthService.createUser(this.state.username, this.state.lastName, this.state.email, this.state.password).then(r => {
                console.log(r.status);
                this.clearFields();
            }).catch(e => {
                console.log("Error during registration : ", e.message)
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
            <Container style={{marginTop: "144px"}} component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={"main-register-form"}>
                    <Avatar className={"user-register-form"}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
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
                                <TextField
                                    id="firstName"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="First Name"
                                    value={this.state.username}
                                    onChange={(event) => this.handleChange(event)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    value={this.state.lastName}
                                    name="lastName"
                                    onChange={(event) => this.handleChange(event)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={this.state.email}
                                    label="Email Address"
                                    name="email"
                                    onChange={(event) => this.handleChange(event)}
                                />
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
                                <TextField
                                    id="password"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={this.state.password}
                                    type="password"
                                    onChange={(event) => this.handleChange(event)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="repeatPassword"
                                    required
                                    variant="outlined"
                                    fullWidth
                                    name="repeatPassword"
                                    label="Repeat password"
                                    value={this.state.repeatPassword}
                                    type="password"
                                    onChange={(event) => this.handleChange(event)}
                                />
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
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link className={"jsLink"} to={"/sign_in"} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" to="/">
                            RS Software
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        );
    }
}

export default withRouter(RegisterForm);