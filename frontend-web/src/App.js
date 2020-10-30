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
import Ws from "./trash/ws";


const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
        }
    }

    render() {
        return (
            <Router>
                <Header/>
                <Ws/>
                <Switch>
                    <Route
                        exact
                        path={"/"}
                        history={history}
                        component={CreateGroup}
                    />
                    <Route exact path="/t/messages" render={(props) =>
                        <WsContainerGlobal
                            {...props}
                            history={history}
                        />}
                    />
                    <Route exact path="/t/messages/:groupId" render={(props) =>
                        <WsContainerGlobal
                            {...props}
                            history={history}
                        />}
                    />
                    <Route exact path="/register" render={(props) =>
                        <RegisterForm
                            {...props}
                            history={history}
                        />}
                    />
                    <Route
                        exact
                        path="/login"
                        history={history}
                        component={Login}
                    />
                </Switch>
            </Router>
        )
    }
}

export default App;
