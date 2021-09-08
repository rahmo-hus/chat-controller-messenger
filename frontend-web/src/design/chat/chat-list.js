import React, {Component} from "react";
import AuthService from "../../service/auth-service";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: null
        }
    }

    componentDidMount() {
        AuthService.fetchMessages(this.props.groupId).then(r => {
            if (r.data.length !== 0) {
                this.setState({history: r.data});
                console.log(r.data)
            }
        })
    }

    render() {
        return (
            <div>
                <h1>Messages :</h1>
                <div>
                    {this.state.history && this.state.history.map((data) => (
                        <p>{data.message}</p>
                    ))}
                </div>
            </div>
        )
    }
}

export default ChatList