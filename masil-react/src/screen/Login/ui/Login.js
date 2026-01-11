import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import kakao from "css/img/socialImg/kakao.png";
import google from "css/img/socialImg/google.jpg";
import naver from "css/img/socialImg/naver.png";
import Modal from "component/Modal";

import "css/Login.css";
import { useLogins } from "../useLogins";

const Login = () => {
  const {
    showPassword,
    loginHandler,
    loginSubmit,
    socialLogin,
    setShowPassword,
    isModalOpen,
    closeModal,
    modalTitle,
    modalMessage,
    modalActions,
  } = useLogins();

  return (
    <div className="login">
      <form className="login_container" onSubmit={(e) => loginSubmit(e)}>
        <h2 className="login_header">로그인</h2>
        <div className="id_container">
          <div className="id_title">아이디</div>
          <input
            className="login_input"
            type="text"
            name="userId"
            placeholder="아이디 입력"
            onChange={(e) => loginHandler(e)}
          />
        </div>
        <div className="id_container">
          <div className="id_title">비밀번호</div>
          <div className="password_input-icon">
            <input
              className="login_input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호 입력"
              onChange={(e) => loginHandler(e)}
            />
            <span
              className="password_icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>

        <div className="btn_container">
          <button className="login_button" type="submit">
            로그인
          </button>
        </div>

        <div className="links">
          <a href="/signup" className="link-item">
            회원가입
          </a>
          <a href="/userfindid" className="link-item">
            아이디/비밀번호 찾기
          </a>
        </div>
        <div className="social-login-title">소셜 계정으로 간편 로그인</div>
        <div className="sns_container">
          <div className="sns_item">
            <button type="button" onClick={() => socialLogin("kakao")} className="sns_button">
              <img src={kakao} alt="카카오 로그인" className="sns_image" />
            </button>
          </div>
          <div className="sns_item">
            <button
              type="button"
              onClick={() => socialLogin("google")}
              className="sns_button"
            >
              <img src={google} alt="구글 로그인" className="sns_image" />
            </button>
          </div>
          <div className="sns_item">
            <button type="button" onClick={() => socialLogin("naver")} className="sns_button">
              <img src={naver} alt="네이버 로그인" className="sns_image" />
            </button>
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </div>
  );
};

export default Login;
