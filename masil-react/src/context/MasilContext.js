import React, { createContext, useState } from "react";
import userDefault from "../css/img/userDefault.svg";
export const ProjectContext = createContext();
export const ProjectProvider = ({ children }) => {
    //로그인 상태
    const [loginSuccess, setLoginSuccess] = useState(false);
    //프로필사진
    const [imagePreview, setImagePreview] = useState(userDefault); 

    const value = {loginSuccess, setLoginSuccess,imagePreview, setImagePreview};
    return (
      <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
    );
}