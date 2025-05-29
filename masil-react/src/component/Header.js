import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";
import useModal from "../context/useModal";
import Modal from "./Modal";

const Header = () => {
  const { loginSuccess, setLoginSuccess, setAccessToken } =
    useContext(ProjectContext);
  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

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
              채팅<i className="ml-1 fas fa-comment-dots"></i>
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
                  LOGOUT
                </button>
                <Link to="/mypage" className="auth_btn">
                  MYPAGE
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="auth_btn">
                  SIGNUP
                </Link>
                <Link to="/login" className="auth_btn">
                  LOGIN
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
