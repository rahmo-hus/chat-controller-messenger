import {connect} from 'react-redux'
import {HeaderComponent} from "../components/header-component";
import {changeCurrentThemeMode, changeThemeMode, initUserData, userLogout} from "../actions";

const mapStateToProps = (state) => {
    const {isDarkModeToggled, currentThemeMode} = state.ThemeReducer;
    const {isUserLoggedIn, usernameLoggedIn} = state.AuthReducer;
    return {
        isDarkModeToggled,
        currentThemeMode,
        isUserLoggedIn,
        usernameLoggedIn
    };
}


const mapDispatchToProps = dispatch => {
    return {
        initUserData: () => dispatch(initUserData()),
        changeThemeMode: () => {
            dispatch(changeThemeMode());
            dispatch(changeCurrentThemeMode())
        },
        changeCurrentThemeMode: () => dispatch(changeCurrentThemeMode()),
        userLogout: () => dispatch(userLogout())
    }
}

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default HeaderContainer;



