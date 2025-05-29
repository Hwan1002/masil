import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
            <button className="logo_btn" onClick={() => navigate("/")}>
              Masil
            </button>
          </div>
          <nav className="header_center">
            <button className="nav_btn" onClick={() => navigate("/rentalitem")}>
              렌탈물품
            </button>
            <button className="nav_btn" onClick={() => navigate("/myrental")}>
              나의 게시글
            </button>
            <button className="nav_btn" onClick={() => navigate("/mywishpost")}>
              찜목록
            </button>
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
                <button
                  className="auth_btn"
                  onClick={() => navigate("/mypage")}
                >
                  MYPAGE
                </button>
              </>
            ) : (
              <>
                <button
                  className="auth_btn"
                  onClick={() => navigate("/signup")}
                >
                  SIGNUP
                </button>
                <button className="auth_btn" onClick={() => navigate("/login")}>
                  LOGIN
                </button>
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
