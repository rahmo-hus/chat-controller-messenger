import React, {Component} from 'react';
import './App.css';
import {createBrowserHistory} from 'history';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import RegisterForm from "./design/register/register-user";
import HeaderContainer from "./container/header-container";
import HomeContainer from "./container/home-container";
import LoginContainer from "./container/login-container";
import CreateGroupContainer from "./container/create-group-container";
import WebSocketMainContainer from "./container/websocket/websocket-main-container";
import CallWindowContainerTRASH from "./container/call-window-containerTRASH";


const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkModeEnabled: false,
            authenticated: null,
            wsToken: null,

            openToaster: false
        };
        this.toggleDarkMode = this.toggleDarkMode.bind(this);
        this.setUserAuthenticated = this.setUserAuthenticated.bind(this);
        this.setWsToken = this.setWsToken.bind(this);
    }

    toggleDarkMode = (value) => {
        this.setState({isDarkModeEnabled: value})
    }

    setUserAuthenticated(value) {
        this.setState({authenticated: value})
    }

    setWsToken(value) {
        this.setState({wsToken: value})
    }

    render() {
        return (
            <Router>
                <HeaderContainer/>
                <Switch>
                    <Route exact path="/" render={(props) =>
                        <HomeContainer
                            {...props}
                        />}
                    />
                    <Route exact path="/create" render={(props) =>
                        <CreateGroupContainer
                            {...props}
                        />}
                    />
                    <Route exact path="/t/messages" render={(props) =>
                        <WebSocketMainContainer
                            {...props}
                        />}
                    />

                    <Route exact path="/t/messages/:groupId" render={(props) =>
                        <WebSocketMainContainer
                            {...props}
                        />}
                    />
                    <Route exact path="/register" render={(props) =>
                        <RegisterForm
                            {...props}
                            history={history}
                            isDarkModeToggled={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/login" render={(props) =>
                        <LoginContainer
                            {...props}
                            history={history}
                        />}
                    />
                </Switch>
            </Router>
        )
    }
}

export default App;
