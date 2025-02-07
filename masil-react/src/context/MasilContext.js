import React, { createContext, useEffect, useState } from "react";
import userDefault from "../css/img/userDefault.svg";
import axios from "axios";
import { useAxiosInterceptor } from "./useAxiosInterceptor";

export const ProjectContext = createContext(
  // {
  // loginSuccess: false,
  // setLoginSuccess: () => {},
  // accessToken: null,
  // setAccessToken: () => {},
  // imagePreview: null,
  // setImagePreview: () => {},
  // isLoading: false,
  // setIsLoading: () => {},
  // }
);
export const ProjectProvider = ({ children }) => {
  //로그인 상태
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  //프로필사진
  const [imagePreview, setImagePreview] = useState(userDefault);
  //로딩중 상태
  const [isLoading, setIsLoading] = useState(false);

  // Axios 인터셉터 초기화
  // useAxiosInterceptor();






  // 새로고침시 refreshToken(httpOnlyCookie) 를통한 accessToken 갱신요청 
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post('http://localhost:9090/auth/refresh-token', {}, { withCredentials: true });
        setAccessToken(response.data.accessToken); // 새로운 Access Token 저장
        setLoginSuccess(true); // 로그인 상태 업데이트
      } catch (error) {
        console.log(error.response.data.error);
        setAccessToken(null); // Access Token 초기화
        setLoginSuccess(false); // 로그인 상태 초기화
      }
    };

    refreshAccessToken(); // 컴포넌트 마운트 시 실행
  }, []);





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