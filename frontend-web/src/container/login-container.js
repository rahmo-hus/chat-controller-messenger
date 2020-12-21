import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import LoginComponent from "../components/login-component";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    return {
        isDarkModeToggled,
        currentThemeMode
    };
}


const LoginContainer = connect(mapStateToProps, null)(LoginComponent);

export default withRouter(LoginContainer);