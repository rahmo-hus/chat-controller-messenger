import {CHANGE_THEME_MODE, DARK_MODE_ENABLED} from "../utils/redux-constants";

const initialState = {
    isDarkModeToggled: true,
    currentThemeMode: "dark"
}

const ThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case DARK_MODE_ENABLED:
            return {...state, isDarkModeToggled: !state.isDarkModeToggled};
        case CHANGE_THEME_MODE:
            return {...state, currentThemeMode: state.currentThemeMode === "light" ? "dark" : "light"};
        default:
            return state;
    }
}

export default ThemeReducer;