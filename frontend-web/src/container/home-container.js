import {connect} from 'react-redux'
import {HomeComponent} from "../components/home-component";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state) => {
    const {currentThemeMode} = state.ThemeReducer;
    return {
        currentThemeMode,
    };
}


const HomeContainer = connect(mapStateToProps, null)(HomeComponent);

export default withRouter(HomeContainer);