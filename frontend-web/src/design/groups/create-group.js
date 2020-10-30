import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthService from "../../service/auth-service";

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
            console.log(r)
        }).catch(err => {
            console.log(err)
        })
    }

    groupNameConstructor(event) {
        let value = event.target.value;
        this.setState({groupName: value});
    }

    generate(element) {
        return this.state.groups.map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        )
    }

    goToChat(event) {
        event.preventDefault();
    }

    componentDidMount() {
        // AuthService.fetchUserInformation().then(r => {
        //     console.log(r);
        //     // console.log(r.data.groupSet)
        //     if (r.data.length !== 0) {
        //         // this.setState(prevState => ({
        //         //     groups: [...prevState.groups, r.data]
        //         // }))
        //         this.setState({groups: r.data});
        //     }
        // })
    }

    render() {
        return (
            <div style={{textAlign: "center", marginTop: "40px"}}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div>
                        <Grid container spacing={2}>
                            {/*<Grid item xs={12} md={6}>*/}
                            {/*    <Typography variant="h6">*/}
                            {/*        My groups*/}
                            {/*    </Typography>*/}
                            {/*    <div>*/}
                            {/*        <List>*/}
                            {/*            {this.state.groups ? this.state.groups.map((val, index) => (*/}
                            {/*                <ListItem key={val.id}>*/}
                            {/*                    <ListItemAvatar>*/}
                            {/*                        <Avatar>*/}
                            {/*                            <FolderIcon/>*/}
                            {/*                        </Avatar>*/}
                            {/*                    </ListItemAvatar>*/}
                            {/*                    <Link to={{*/}
                            {/*                        pathname: "/t/messages",*/}
                            {/*                        groupId: val.id*/}
                            {/*                    }}>*/}
                            {/*                        <ListItemText*/}
                            {/*                            primary={val.name}*/}
                            {/*                        />*/}
                            {/*                    </Link>*/}
                            {/*                </ListItem>*/}
                            {/*            )) : <ListItem/>*/}
                            {/*            }*/}
                            {/*        </List>*/}
                            {/*    </div>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </div>
                    <div className={"main-register-form"}>
                        <Typography component="h1" variant="h5">
                            Créer un groupe
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
                                            variant="contained"
                                            color="primary"
                                        >
                                            Valider
                                        </Button>
                                    </Grid>
                                </div>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </div>
        )
    }
}

export default CreateGroup;