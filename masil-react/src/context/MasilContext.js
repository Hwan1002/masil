import React, { createContext, useEffect, useState } from "react";
import userDefault from "../css/img/userDefault.svg";
import axios from "axios";

export const ProjectContext = createContext();

// Axios 인스턴스 생성
export const Api = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true,
});


export const ProjectProvider = ({ children }) => {
  //로그인 상태
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  //프로필사진
  const [imagePreview, setImagePreview] = useState(userDefault);
  //로딩중 상태
  const [isLoading, setIsLoading] = useState(false);

  // 새로고침시 refreshToken(httpOnlyCookie) 를통한 accessToken 갱신요청 
  const refreshToken = async () => {
    try {
      const { data } = await Api.post(
        '/auth/refresh-token',
        {},
        { withCredentials: true }
      );
      console.log(data)
      setAccessToken(data.accessToken);
      setLoginSuccess(true);
      return data.accessToken;
    } catch (error) {
      console.log(error.response.data.error);
      setAccessToken(null);
      setLoginSuccess(false);
    }
  };

  // 최초 렌더링시 토큰갱신시도 
  useEffect(() => {
    if (!accessToken) refreshToken();
  }, []);

  // 인터셉터 설정
  useEffect(() => {
    let isRefreshing = false;

    // 요청 인터셉터
    const reqInterceptor = Api.interceptors.request.use(config => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    // 응답 인터셉터
    const resInterceptor = Api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // 401/403 에러 & 첫 재시도
        if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
          originalRequest._retry = true;

          // 중복 갱신 방지
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const { data } = await Api.post('/auth/refresh-token', {}, { withCredentials: true });
              setAccessToken(data.accessToken);
              setLoginSuccess(true);
              // 새 config 생성
              return Api({
                ...originalRequest,
                headers: {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${data.accessToken}`
                }
              });

            } catch (refreshError) {
              setAccessToken(null);
              setLoginSuccess(false);
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      Api.interceptors.request.eject(reqInterceptor);
      Api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);



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