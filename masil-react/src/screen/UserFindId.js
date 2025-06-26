import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import axios from "axios";
import "../css/UserFindId.css";

const UserFindId = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); //로딩상태 false일땐 찾기 true일땐 전송 중...
  const [email, setEmail] = useState("");

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      openModal({
        title: `이메일 입력`,
        message: `이메일을 입력해주세요.`,
      });
      return;
    }

    setIsLoading(true); //로딩버튼을 전송 중... 버튼으로 바꿈

    try {
      const response = await axios.post(
        `http://localhost:9090/user/findUserId`,
        {
          email: email,
        }
      );
      const userId = response.data.value;
      openModal({
        message: `회원님의 아이디는  "${userId}" 입니다.`,
      });
    } catch (error) {
      openModal({
        title: "경고",
        message: error.response.data.error,
      });
    }
  };

  const handleModalClose = () => {
    closeModal();
    setIsLoading(false); // 로딩버튼을 다시 찾기버튼으로 바꿈
    setEmail(""); // 이메일 입력 값 초기화는 모달 닫을 때만
  };

  //엔터키 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form className="FindId_container" onSubmit={handleSubmit}>
      <h2>아이디 찾기</h2>

      <div className="FindId_left">이메일</div>
      <div className="FindId_inputContainer">
        <div className="FindId_inputWrapper">
          <input
            className="FindId_input"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button type="submit" className="FindId_sendBtn" disabled={isLoading}>
            {isLoading ? "전송 중..." : "찾기"}
          </button>
        </div>
      </div>

      <div className="FindId_flexrow">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="FindId_button"
        >
          돌아가기
        </button>
        <button
          type="button"
          onClick={() => navigate("/userfindpwd")}
          className="FindId_button"
        >
          비밀번호 찾기
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </form>
  );
};

export default UserFindId;
