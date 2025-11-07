import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChats } from "../useChats.js";
import { formatDateTime } from "utils/utils.ts";
import defaultProfile from "css/img/userDefault.svg";
import "css/Chat.css";

const Chat = () => {
  const navigate = useNavigate();

  const {
    chatRooms,
    loading,
    roomsToDisplay,
    createTestChatRoom,
    handleRoomClick,
    getPartnerNickname,
    getPartnerProfilePhoto,
  } = useChats();

  // 모든 채팅방의 읽지 않은 메시지 수 합계 계산 및 Header에 전달
  useEffect(() => {
    if (!loading && Array.isArray(roomsToDisplay)) {
      const totalUnreadCount = roomsToDisplay.reduce((sum, room) => {
        const unreadCount = room.unreadCount || 0;
        return sum + unreadCount;
      }, 0);

      console.log("총 읽지 않은 메시지 수:", totalUnreadCount);
      
      // Header에 총합 전달
      window.dispatchEvent(
        new CustomEvent("totalUnreadCountUpdate", {
          detail: { totalUnreadCount },
        })
      );
    }
  }, [roomsToDisplay, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-44">
      <div className="chat-container">
        <h2 className="flex gap-2 items-center mb-6 text-2xl font-bold text-gray-800">
          <i className="text-green-500 fas fa-comments"></i>
          마실 채팅
        </h2>
        <div className="flex flex-col justify-center items-center">
          <div className="overflow-y-auto p-2 mb-4 text-xs bg-gray-100 rounded w-[40vw] h-[30vh]">
            <h2> 디버깅 정보 </h2>
            <p>chatRooms 타입: {typeof chatRooms}</p>
            <p>
              chatRooms 길이:{" "}
              {Array.isArray(chatRooms) ? chatRooms.length : "N/A"}
            </p>
            <p>chatRooms 내용: {JSON.stringify(chatRooms, null, 2)}</p>
            {roomsToDisplay.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-bold">
                  각 채팅방 프로필 이미지 정보:
                </h3>
                {roomsToDisplay.map((room) => (
                  <div key={room.roomId} className="p-2 mb-2 bg-white rounded">
                    <p>Room ID: {room.roomId}</p>
                    <p>
                      lenderProfilePhotoPath:{" "}
                      {room.lenderProfilePhotoPath || "없음"}
                    </p>
                    <p>
                      borrowerProfilePhotoPath:{" "}
                      {room.borrowerProfilePhotoPath || "없음"}
                    </p>
                    <p>lenderId: {room.lenderId}</p>
                    <p>borrowerId: {room.borrowerId}</p>
                    <p>
                      가져온 프로필: {getPartnerProfilePhoto(room) || "없음"}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              {roomsToDisplay.map((room) => {
                const profilePhoto = getPartnerProfilePhoto(room);
                const imageSrc = profilePhoto
                  ? `http://localhost:9090${profilePhoto}`
                  : defaultProfile;

                console.log("Chat 컴포넌트 - room:", room);
                console.log("Chat 컴포넌트 - profilePhoto:", profilePhoto);
                console.log("Chat 컴포넌트 - imageSrc:", imageSrc);

                return (
                  <div
                    key={room.roomId}
                    onClick={() => handleRoomClick(room)}
                    className="chatRoom"
                  >
                    <div className="relative">
                      <img
                        src={imageSrc}
                        alt={`${getPartnerNickname(room)}의 프로필`}
                        className="chatRoomProfilePhoto"
                        onError={(e) => {
                          console.error("이미지 로딩 실패:", imageSrc);
                          e.target.src = defaultProfile;
                        }}
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <span className="font-medium text-gray-900">
                            {getPartnerNickname(room)}
                          </span>
                          {room.unreadCount > 0 && (
                            <span className="flex justify-center items-center min-w-[20px] h-5 px-1.5 text-xs text-white bg-red-500 rounded-full">
                              {room.unreadCount > 99 ? "99+" : room.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(
                            room.createdAt,
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        채팅방 ID: {room.roomId}
                      </p>
                      <span className="flex justify-end items-end">
                        <button className="chatRoomLeaveButton">나가기</button>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
