import React from "react";
import { useNavigate } from "react-router-dom";
import { useChats } from "../useChats.js";
import { formatDate } from "utils/utils.ts";
import defaultProfile from "css/img/userDefault.svg";

const Chat = () => {
  const navigate = useNavigate();

  const {
    chatRooms,
    loading,
    roomsToDisplay,
    createTestChatRoom,
    handleRoomClick,
    getPartnerNickname,
  } = useChats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center mt-40">
        <div className="w-[500px] h-auto p-4 bg-white rounded-xl shadow-lg">
          <h2 className="flex gap-2 items-center mb-6 text-2xl font-bold text-gray-800">
            <i className="text-green-500 fas fa-comments"></i>
            채팅
          </h2>

          <div className="overflow-y-auto p-2 mb-4 text-xs bg-gray-100 rounded">
            <h2> 디버깅 정보 </h2>
            <p>chatRooms 타입: {typeof chatRooms}</p>
            <p>
              chatRooms 길이:{" "}
              {Array.isArray(chatRooms) ? chatRooms.length : "N/A"}
            </p>
            <p>chatRooms 내용: {JSON.stringify(chatRooms)}</p>
          </div>

          {roomsToDisplay.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-16 text-gray-500">
              <i className="mb-4 text-5xl opacity-30 fas fa-comments"></i>
              <p className="text-lg">대화 가능한 채팅방이 없습니다.</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={createTestChatRoom}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  테스트 채팅방 생성
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  뒤로가기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {roomsToDisplay.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => handleRoomClick(room)}
                  className="flex items-center p-4 rounded-lg border border-gray-100 transition-colors cursor-pointer hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={defaultProfile}
                      alt={`${getPartnerNickname(room)}의 프로필`}
                      className="object-cover w-12 h-12 rounded-full"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {getPartnerNickname(room)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(room.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      채팅방 ID: {room.roomId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
