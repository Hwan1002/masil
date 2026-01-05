import React, {
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";
import useModal from "../context/useModal";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom"

const Header = () => {
  const { loginSuccess, setLoginSuccess, accessToken, setAccessToken } =
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

  const [totalUrMessageCn, setTotalUrMessageCn] = useState(0);

  // getTotalUnreadMessageCount 함수를 useCallback으로 감싸기
  const getTotalUnreadMessageCount = useCallback(async () => {
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
        const result = await response.json();
        console.log("읽지 않은 메시지 수:", result);
        setTotalUrMessageCn(result || 0);
      }
    } catch (error) {
      console.error("읽지 않은 메시지 수 조회 실패:", error);
    }
  }, [accessToken]);

  useLayoutEffect(() => {
    getTotalUnreadMessageCount();

    // 주기적으로 업데이트 (30초마다)
    const interval = setInterval(() => {
      if (accessToken && loginSuccess) {
        getTotalUnreadMessageCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [accessToken, loginSuccess, getTotalUnreadMessageCount]);

  // 전역 이벤트 리스너로 실시간 업데이트 처리
  useLayoutEffect(() => {
    // WebSocket에서 오는 개별 채팅방의 읽지 않은 메시지 수 업데이트
    const handleUnreadCountUpdate = (event) => {
      const unreadCount = event.detail?.unreadCount;
      if (typeof unreadCount === "number") {
        console.log("읽지 않은 메시지 수 실시간 업데이트:", unreadCount);
        // 개별 채팅방 업데이트는 전체 조회로 처리
        if (accessToken && loginSuccess) {
          getTotalUnreadMessageCount();
        }
      }
    };

    // Chat.js에서 계산된 총 읽지 않은 메시지 수 업데이트
    const handleTotalUnreadCountUpdate = (event) => {
      const totalUnreadCount = event.detail?.totalUnreadCount;
      if (typeof totalUnreadCount === "number") {
        console.log(
          "Chat.js에서 계산된 총 읽지 않은 메시지 수:",
          totalUnreadCount
        );
        setTotalUrMessageCn(totalUnreadCount);
      }
    };

    window.addEventListener("unreadCountUpdate", handleUnreadCountUpdate);
    window.addEventListener(
      "totalUnreadCountUpdate",
      handleTotalUnreadCountUpdate
    );

    return () => {
      window.removeEventListener("unreadCountUpdate", handleUnreadCountUpdate);
      window.removeEventListener(
        "totalUnreadCountUpdate",
        handleTotalUnreadCountUpdate
      );
    };
  }, [accessToken, loginSuccess, getTotalUnreadMessageCount]);

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

  const handleRentalClick = (e, item) => {
    e.preventDefault();
    if (loginSuccess) {
      navigate(`/myrental`);
    } else {
      openModal({
        message: "로그인이 필요한 서비스입니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              // navigate("/login");
            },
          },
        ],
      });
    }
  };

  const handleWishPostClick = (e, item) => {
    e.preventDefault();
    if (loginSuccess) {
      navigate(`/mywishpost`);
    } else {
      openModal({
        message: "로그인이 필요한 서비스입니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              // navigate("/login");
            },
          },
        ],
      });
    }
  };

  const handleChatClick = (e, item) => {
    e.preventDefault();
    if (loginSuccess) {
      navigate(`/chat`);
    } else {
      openModal({
        message: "로그인이 필요한 서비스입니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              // navigate("/login");
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
            <Link to="/myrental" className="nav_btn" onClick={(e) => handleRentalClick(e, "/myrental")}>
              나의 게시글
            </Link>
            <Link to="/mywishpost" className="nav_btn" onClick={(e) => handleWishPostClick(e, "/mywishpost")}>
              찜<i className="ml-1 text-red-500 fas fa-heart"></i>
            </Link>
            <Link to="/chat" className="nav_btn" onClick={(e) => handleChatClick(e, "/chat")}>
              <div className="flex justify-center items-center w-[80px]">
                채팅
                <i className="ml-1 fas fa-comment-dots text-[#a9ddb7]"></i>
                {totalUrMessageCn > 0 && (
                  <span className="flex justify-center items-center ml-1 min-w-[20px] h-5 px-1 text-xs text-white bg-red-500 rounded-full animate-shake">
                    {totalUrMessageCn > 99 ? "99+" : totalUrMessageCn}
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
