import {connect} from 'react-redux'
import {CreateGroupComponent} from "../components/create-group-component";

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


const CreateGroupContainer = connect(mapStateToProps, null)(CreateGroupComponent);

export default CreateGroupContainer;