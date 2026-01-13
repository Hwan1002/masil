import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { formatMessageTime } from "../utils/utils.ts";

export default function ChatRoom() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const { room, messages, wsRef, sendMessage, disconnectWebSocket } =
    useChatContext();

  // 로컬스토리지에서 로그인 정보 객체로 파싱해서 갖고옴
  const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
  const myUserId = loginInfo?.state?.userId;

  // 메시지가 추가될 때 자동으로 스크롤 (새 메시지 감지)
  useEffect(() => {
    // 짧은 지연을 두어 DOM 업데이트 후 스크롤
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // 컴포넌트 언마운트 시 WebSocket 연결 해제 (걍 채팅방에서 나가면 연결 해제라는 뜻)
  useEffect(() => {
    return () => {
      if (disconnectWebSocket) {
        disconnectWebSocket();
      }
    };
  }, [disconnectWebSocket]);

  // 상대방 닉네임을 반환하는 함수
  const getPartnerNickname = (room) => {
    if (!room) return "채팅방";
    if (myUserId === room.lenderId) return room.borrowerNickname;
    if (myUserId === room.borrowerId) return room.lenderNickname;
    return "채팅방";
  };

  // 상대방 ID를 반환하는 함수
  const getPartnerId = (room) => {
    if (!room) return null;
    if (myUserId === room.lenderId) return room.borrowerId;
    if (myUserId === room.borrowerId) return room.lenderId;
    return null;
  };

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const partnerId = getPartnerId(room);
    if (!partnerId) {
      alert("상대방 정보를 찾을 수 없습니다.");
      return;
    }
    // WebSocket 연결 상태 확인
    if (!wsRef.current) {
      console.error("WebSocket 연결이 없습니다. 현재 상태:", wsRef.current);
      alert("채팅 연결이 설정되지 않았습니다. 페이지를 새로고침해주세요.");
      return;
    }

    const readyState = wsRef.current.readyState;
    console.log("WebSocket 상태 확인:", {
      readyState: readyState,
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED,
    });

    if (readyState !== WebSocket.OPEN) {
      console.error("WebSocket이 열려있지 않습니다. 상태:", readyState);
      alert(
        `채팅 연결이 끊어졌습니다. (상태: ${readyState}) 페이지를 새로고침해주세요.`
      );
      return;
    }

    const success = sendMessage(inputMessage, partnerId);
    if (success) {
      setInputMessage(""); // 입력창 비우기
    } else {
      alert("메시지 전송에 실패했습니다.");
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 최근에 온 메시지 확인할때 스크롤 맨 아래로
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  if (!room) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-gray-500">채팅방을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center" style={{ height: '100vh' }}>
      <div className="flex justify-center items-center mt-20">
        <h2>{getPartnerNickname(room)}님과 대화</h2>
      </div>
      <div className="overflow-hidden  mt-5 max-w-2xl rounded-lg border shadow-md w-[100%]">
        {/* 채팅 헤더 */}
        <div className="flex justify-between items-center px-4 py-3 text-lg font-semibold text-white bg-green-500">
          <div className="flex gap-2 items-center">
            <span>{getPartnerNickname(room)}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-2 py-1 text-sm text-green-500 bg-white rounded hover:bg-green-100"
          >
            ← 뒤로가기
          </button>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="overflow-y-auto p-4 mt-5 space-y-3 h-80 bg-gray-50">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              아직 메시지가 없습니다.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.messageId || `msg-${index}`}
                className={`flex ${
                  msg.senderId === myUserId ? "justify-end" : "justify-start"
                } animate-fade-in`}
                style={{
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow transition-all duration-300 ${
                    msg.senderId === myUserId
                      ? "bg-green-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.senderId === myUserId
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(msg.sentAt)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="flex border-t">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            className="flex-1 px-4 py-2 outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
