import React from "react";

export const HomeComponent = ({currentThemeMode}) => {
// export const HomeComponent = (props) => {
    return (
        <div className={currentThemeMode}
             style={{width: "100%", height: "calc(100% - 64px)", textAlign: "center"}}>
            <img src={"/assets/img/messengerlite.png"} alt={"messenger lite"} width={"200px"}/>
        </div>
    )
}
