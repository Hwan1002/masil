import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useLoginStore from "shared/useLoginStore";
import useModal from "context/useModal";

export const useLogins = () => {
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
      const response = await Api.post(
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
                    navigate("/");
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

  return {
    showPassword,
    loginInfo,
    isModalOpen,
    closeModal,
    modalTitle,
    modalMessage,
    modalActions,
    setShowPassword,
    loginHandler,
    loginSubmit,
    socialLogin,
  };
};
