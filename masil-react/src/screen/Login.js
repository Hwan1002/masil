import React, { useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 아이콘 가져오기
import "../css/Login.css";
import kakao from "../css/img/socialImg/kakao.png";
import google from "../css/img/socialImg/google.jpg";
import naver from "../css/img/socialImg/naver.png";
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import axios from "axios";
import { ProjectContext } from "../context/MasilContext";
import { useNavigate } from "react-router-dom";
import useLoginStore from "../shared/useLoginStore";
const Login = () => {
  // 비밀번호 보이기, 숨기기 버튼 상태
  const [showPassword, setShowPassword] = useState(false);
  //form 값 상태
  const [loginInfo, setLoginInfo] = useState({});
  //로그인 성공 여부
  const { setLoginSuccess, setAccessToken } = useContext(ProjectContext);

  const { setUserId } = useLoginStore();

  const navigate = useNavigate();
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  //  const [tokenTimer, setTokenTimer] = useState(0);
  // const [timeText, setTimeText] = useState("");
  // if(accessToken !== null){
  //   setTokenTimer(300);
  //   setTimeText(`남은 토큰 시간 : ${tokenTimer}`);
  // }

  const savedUserId = (userId) => {
    setUserId(userId);
    console.log("로그인 성공후 zustand 저장 : ", userId);
  };

  //로그인 값 핸들러
  const loginHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEmpty = Object.values(loginInfo).some((value) => !value);
      if (isEmpty) {
        openModal({
          message: "빈칸을 입력해주세요.",
        });
        return;
      }
      if (!loginInfo.password) {
        openModal({
          message: "비밀번호를 입력해주세요.",
        });
        return;
      }
      const response = await axios.post(
        "http://localhost:9090/user/login",
        loginInfo,
        { withCredentials: true } // 쿠키포함
      );
      if (response) {
        setLoginSuccess(true);
        openModal({
          message: response.data.value,
          actions: [
            {
              label: "확인",
              onClick: () => {
                setAccessToken(response.data.accessToken);
                savedUserId(response.data.userId);
                closeModal();
                navigate("/");
              },
            },
          ],
        });
        // 쿠키활용해서 토큰 저장하기 구현
      } else {
        openModal({
          message: response.data.value,
        });
        return;
      }
    } catch (error) {
      openModal({
        message: error.response.data.error,
      });
    }
  };

  const socialLogin = (social) => {
    window.open(
      `http://localhost:9090/oauth2/authorization/${social}`,
      "소셜 로그인",
      "width=600,height=800"
    );

    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== "http://localhost:9090") return;

        // 성공 케이스
        if (event.data.success) {
          setLoginSuccess(true); 
          // hasAddress ( 주소값이 설정되어있을때 true)
          if (event.data.data.hasAddress) {
            // 주소값이 설정되어있을때의 로그인 로직 
            openModal({
              message: event.data.data.value,
              actions: [
                {
                  label: "확인",
                  onClick: () => {
                    savedUserId(event.data.data.userId);
                    closeModal();
                    navigate("/");;
                  },
                },
              ],
            });
          } else {
            // 주소값이 설정되어있지 않을때의 로그인 로직
            openModal({
              message: "주소를 등록해주세요!",
              actions: [
                {
                  label: "주소 등록하러 가기",
                  onClick: () => {
                    savedUserId(event.data.data.userId);
                    closeModal();
                    window.location.href = "/";
                  },
                },
              ],
            });
            // 또는 React Router를 사용한다면
            // navigate("/register-address");
          }
        // 실패 케이스
        } else {
          openModal({
            message: event.data.error,
            actions: [
              {
                label: "확인",
                onClick: () => {
                  closeModal();
                  window.location.href = "/login";
                },
              },
            ],
          });
        }
      },
      { once: true }
    );
  };

  return (
    <>
      <form className="login_container" onSubmit={(e) => loginSubmit(e)}>
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
            <a onClick={(e) => socialLogin("kakao")}>
              <img src={kakao} alt="카카오 로그인" className="sns_image" />
            </a>
          </div>
          <div className="sns_item">
            <a onClick={(e) => socialLogin("google")}>
              <img src={google} alt="구글 로그인" className="sns_image" />
            </a>
          </div>
          <div className="sns_item">
            <a onClick={(e) => socialLogin("naver")}>
              <img src={naver} alt="네이버 로그인" className="sns_image" />
            </a>
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
    </>
  );
};

export default Login;
