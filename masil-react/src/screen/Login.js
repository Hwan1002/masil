import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 아이콘 가져오기
import '../css/Login.css';
import kakao from '../css/img/socialImg/kakao.png'
import google from '../css/img/socialImg/google.jpg'
import naver from '../css/img/socialImg/naver.png'
import axios from 'axios';
const Login = () => {
    // 비밀번호 보이기, 숨기기 버튼 상태
    const [showPassword, setShowPassword] = useState(false);
    const [loginInfo, setLoginInfo] = useState({});

    //로그인 값 핸들러
    const loginHandler = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    }

    const loginSubmit = async() => {
        try {
            const response = await axios.post("http://localhost:9090/user/login", loginInfo);
            if(response){
                alert(response.data.value);
            }
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    return (
      <form className="login_container" onSubmit={loginSubmit}>
        <h2>로그인</h2>
        {/* 일반 로그인 */}
        <div>
          <div>아이디</div>
          <input
            className="login_input"
            type="text"
            name="userId"
            placeholder="아이디 입력"
            onChange={(e) => loginHandler(e)}
          />
        </div>
        <div className="password_container">
          <div>비밀번호</div>
          <div className="password_input-icon">
            <input
              className="password_input"
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

        {/* 로그인 버튼 */}
        <div>
          <button className="login_button" type="submit">
            로그인
          </button>
        </div>

        {/* 추가 링크 */}
        <div className="links ">
          <a href="/signup" className="link-item">
            회원가입
          </a>
          <a href="/userfindid" className="link-item">
            아이디/비밀번호 찾기
          </a>
        </div>

        {/* 문구 추가 */}
        <div className="social-login-title">소셜 계정으로 간편 로그인</div>

        {/* SNS 로그인 */}
        <div className="sns_container">
          <div className="sns_item">
            <a
              href="https://kauth.kakao.com/oauth/authorize"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={kakao} alt="카카오 로그인" className="sns_image" />
            </a>
          </div>
          <div className="sns_item">
            <a
              href="https://accounts.google.com/signin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={google} alt="구글 로그인" className="sns_image" />
            </a>
          </div>
          <div className="sns_item">
            <a
              href="https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={naver} alt="네이버 로그인" className="sns_image" />
            </a>
          </div>
        </div>
      </form>
    );
};

export default Login;
