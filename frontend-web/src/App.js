import React, {Component} from 'react';
import './App.css';
import {createBrowserHistory} from 'history';
import Header from "./design/partials/header";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./design/login/login";
import CreateGroup from "./design/groups/create-group";
import WsContainerGlobal from "./design/websocket/ws-container-global";
import RegisterForm from "./design/register/register-user";
import HomePage from "./design/home";


const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkModeEnabled: false,
            authenticated: null,

            openToaster: false
        };
        this.toggleDarkMode = this.toggleDarkMode.bind(this);
        this.setUserAuthenticated = this.setUserAuthenticated.bind(this);
    }

    toggleDarkMode = (value) => {
        this.setState({isDarkModeEnabled: value})
    }

    setUserAuthenticated(value) {
        this.setState({authenticated: value})
    }

    render() {
        return (
            <Router>
                <Header history={history} toggleDarkMode={this.toggleDarkMode} authenticated={this.state.authenticated}
                        setUserAuthenticated={this.setUserAuthenticated}/>
                <Switch>
                    <Route exact path="/" render={(props) =>
                        <HomePage
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/create" render={(props) =>
                        <CreateGroup
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/t/messages" render={(props) =>
                        <WsContainerGlobal
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/t/messages/:groupId" render={(props) =>
                        <WsContainerGlobal
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/register" render={(props) =>
                        <RegisterForm
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                        />}
                    />
                    <Route exact path="/login" render={(props) =>
                        <Login
                            {...props}
                            history={history}
                            isDarkModeEnable={this.state.isDarkModeEnabled}
                            setUserAuthenticated={this.setUserAuthenticated}
                        />}
                    />
                </Switch>
            </Router>
        )
    }
}

export default App;
