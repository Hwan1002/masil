import React, { createContext, useState } from "react";
import userDefault from "../css/img/userDefault.svg";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    //로그인 상태
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [accessToken, setAccessToken] = useState();
   
    //프로필사진
    const [imagePreview, setImagePreview] = useState(userDefault); 
    //로딩중 상태
    const [isLoading, setIsLoading] = useState(false);

    const value = {
      loginSuccess, setLoginSuccess,
      accessToken, setAccessToken,
      // tokenTimer, setTokenTimer,
      // timeText, setTimeText,
      imagePreview, setImagePreview,
      isLoading, setIsLoading,
    };

    return (
      <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
    );
}