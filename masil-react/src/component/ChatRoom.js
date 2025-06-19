import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-20 pt-5 border rounded-lg shadow-md overflow-hidden">
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between bg-green-500 text-white px-4 py-3 text-lg font-semibold">
        <span>채팅방</span>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-2 py-1 bg-white text-green-500 rounded hover:bg-green-100"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <div className="self-start max-w-xs p-2 bg-white border rounded shadow">
          안녕하세요!
        </div>
        <div className="self-end max-w-xs p-2 text-white bg-green-500 rounded shadow ml-auto">
          안녕하세요~ 반갑습니다.
        </div>
        <div className="self-start max-w-xs p-2 bg-white border rounded shadow">
          궁금한 게 있어서요
        </div>
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
