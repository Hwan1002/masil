import React, { useContext, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";
import useModal from "../context/useModal";
import Modal from "./Modal";

const Header = () => {
  const { loginSuccess, setLoginSuccess, accessToken, setAccessToken } =
    useContext(ProjectContext);

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const [totalUrMessageCn, setTotalUrMessageCn] = useState(0);

  const [isRead, setIsRead] = useState(false);

  useLayoutEffect(() => {
    const getTotalUnreadMessageCount = async () => {
      if (!accessToken) {
        console.log("토큰이 없어서 함수 종료");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:9090/chatting/unread-count",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.error("응답 오류:", response.status, response.statusText);
          return;
        } else {
          setIsRead(false);
          const result = await response.json();
          setTotalUrMessageCn(result);
        }
      } catch (error) {
        console.error("읽지 않은 메시지 수 조회 실패:", error);
      }
    };

    getTotalUnreadMessageCount();
  }, [accessToken]);

  const logoutClicked = async () => {
    try {
      const response = await Api.post("/user/logout");
      if (response) {
        setLoginSuccess(false);
        setAccessToken(null);
        window.location.replace("/");
      }
    } catch (error) {
      openModal({
        message: "로그아웃 중 오류가 발생하였습니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              window.location.replace("/");
            },
          },
        ],
      });
    }
  };

  console.log("메시지 토탈 수", totalUrMessageCn);
  return (
    <>
      <header className="header">
        <div className="header_container">
          <div className="header_left">
            <a href="/" className="logo_btn">
              Masil
            </a>
          </div>
          <nav className="header_center">
            <Link to="/rentalitem" className="nav_btn">
              렌탈물품
            </Link>
            <Link to="/myrental" className="nav_btn">
              나의 게시글
            </Link>
            <Link to="/mywishpost" className="nav_btn">
              찜<i className="ml-1 text-red-500 fas fa-heart"></i>
            </Link>
            <Link to="/chat" className="nav_btn">
              <div className="flex justify-center items-center w-[80px]">
                채팅
                <i className="ml-1 fas fa-comment-dots text-[#a9ddb7]"></i>
                {totalUrMessageCn > 0 && isRead && (
                  <span className="flex justify-center items-center ml-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full animate-shake">
                    {totalUrMessageCn}
                  </span>
                )}
              </div>
            </Link>
          </nav>
          <div className="header_right">
            {loginSuccess ? (
              <>
                <button
                  className="auth_btn"
                  onClick={() =>
                    openModal({
                      message: "로그아웃 하시겠습니까?",
                      actions: [
                        {
                          label: "확인",
                          onClick: () => {
                            logoutClicked();
                          },
                        },
                        { label: "취소", onClick: closeModal },
                      ],
                    })
                  }
                >
                  로그아웃
                </button>
                <Link to="/mypage" className="auth_btn">
                  마이페이지
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="auth_btn">
                  회원가입
                </Link>
                <Link to="/login" className="auth_btn">
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
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
export default Header;
