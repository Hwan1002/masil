import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/MasilContext";

export default function ChatRoom() {
  const navigate = useNavigate();
  const { room, messages } = useContext(ProjectContext);

  // 로컬스토리지에서 로그인 정보 파싱
  const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
  // userId 추출 
  const myUserId = loginInfo?.state?.userId;

  // 상대방 닉네임을 반환하는 함수
  const getPartnerNickname = (room) => {
    if (!room) return "채팅방";
    if (myUserId === room.lenderId) return room.borrowerNickname;
    if (myUserId === room.borrowerId) return room.lenderNickname;                                                 
    return "채팅방";
  };





  return (
    <div className="max-w-2xl mx-auto mt-20 pt-5 border rounded-lg shadow-md overflow-hidden">
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between bg-green-500 text-white px-4 py-3 text-lg font-semibold">
        <span>{getPartnerNickname(room)}</span>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-2 py-1 bg-white text-green-500 rounded hover:bg-green-100"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded shadow ${msg.senderId === myUserId
              ? "self-end bg-green-500 text-white ml-auto"
              : "self-start bg-white border"
              }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex border-t">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2 outline-none"
        />
        <button className="px-4 bg-green-500 text-white">전송</button>
      </div>
    </div>
  );
}