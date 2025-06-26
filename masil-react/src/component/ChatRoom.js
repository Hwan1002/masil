import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/MasilContext";
import "../css/ChatRoom.css"
export default function ChatRoom() {
  const navigate = useNavigate();
  const { room, messages, setMessages ,accessToken } = useContext(ProjectContext);
  const [input, setInput] = useState("");
  const wsRef = useRef(null) ;


  // 로컬스토리지에서 로그인 정보 파싱
  // const loginInfo = window.localStorage.getItem("login-storage");
  const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
  console.log("스토리지 값", loginInfo);

  // userId 추출
  const myUserId = loginInfo?.state?.userId;


  // WebSocket 연결 및 메시지 수신 처리
  useEffect(() => {
    // room이 없으면 연결하지 않음
    if (!room?.roomId) return;

    // accessToken은 실제로는 로그인 정보에서 가져오세요
    const accessToken = loginInfo?.state?.accessToken || "user_token_here";

    // WebSocket 연결 생성
    wsRef.current = new WebSocket(
      `ws://localhost:9090/chat?roomId=${room.roomId}`,
      ["chat-v1", accessToken]
    );

    // 메시지 수신 핸들러
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [room?.roomId]); // roomId가 바뀔 때마다 재연결


  // 상대방 닉네임을 반환하는 함수
  const getPartnerNickname = (room) => {
    if (!room) return "채팅방";
    if (myUserId === room.lenderId) return room.borrowerNickname;
    if (myUserId === room.borrowerId) return room.lenderNickname;
    return "채팅방";
  };

  // 메시지 전송 함수
  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;
    const message = {
      content: input,
      senderId: myUserId,
      roomId: room?.roomId,
    };
    wsRef.current.send(JSON.stringify(message));
    setInput("");
  };

   return (
    <div className="chat-room-container">
      <div className="chat-header">
        <span>{getPartnerNickname(room)}</span>
        <button onClick={() => navigate(-1)}>← 뒤로가기</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.senderId === myUserId ? "outgoing" : "incoming"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요"
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-button">
          전송
        </button>
      </div>
    </div>
  );
}
