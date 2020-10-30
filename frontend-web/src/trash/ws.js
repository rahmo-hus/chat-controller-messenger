import React, {Component} from "react";
import * as SockJS from 'sockjs-client';

class Ws extends Component {


    connect() {
        const sock = new SockJS('ws');
        sock.onopen = function() {
            console.log('open');
            sock.send('test');
        };

        sock.onmessage = function(e) {
            console.log('message', e.data);
            sock.close();
        };

        sock.onclose = function() {
            console.log('close');
        };
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        return (
            <div>
                <h1>ça marche</h1>
            </div>
        );
    }
}

export default Ws